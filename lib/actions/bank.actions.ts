"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { getBanks, getBank } from "./user.actions";
import { getTransactionsByBankId } from "./transactions.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          shareableId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {

    
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    let transferTransactions = [];
    try {
      const transferTransactionsData = await getTransactionsByBankId({
        bankId: bank.$id,
      });

      if (transferTransactionsData?.documents) {
        transferTransactions = transferTransactionsData.documents.map(
          (transferData: Transaction) => ({
            id: transferData.$id,
            name: transferData.name!,
            amount: transferData.amount!,
            date: transferData.$createdAt,
            paymentChannel: transferData.channel,
            category: transferData.category,
            type: transferData.senderBankId === bank.$id ? "debit" : "credit",
          })
        );
      }
    } catch (error) {
      console.error("Error getting transfer transactions:", error);
    }

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    // Get Plaid transactions
    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });


    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // Combine and sort transactions
    const allTransactions = [...(transactions || []), ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );


    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
    return null;
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
  }
};

// Get transactions - FIXED VERSION
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  try {
    
    // For Plaid Sandbox, we need to use transactions/get first
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - (730 * 24 * 60 * 60 * 1000));
    
    try {
      // Try transactions/get first (this usually works better in sandbox)
      const transactionsResponse = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: twoYearsAgo.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0],
        options: {
          count: 100,
          offset: 0,
        }
      });
      
      const transactions = transactionsResponse.data.transactions.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.amount > 0 ? 'debit' : 'credit', // Plaid uses positive for debits
        accountId: transaction.account_id,
        amount: Math.abs(transaction.amount), // Make amount positive
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url || null,
      }));
      
      return parseStringify(transactions);
      
    } catch (getError: any) {
      console.log('transactions/get failed, trying sync:', getError.response?.data || getError.message);
      
      // Fallback to transactions/sync
      let hasMore = true;
      let transactions: any = [];
      let cursor;

      while (hasMore) {
        const response = await plaidClient.transactionsSync({
          access_token: accessToken,
          cursor: cursor,
        });

        const data = response.data;
        cursor = data.next_cursor;
        
        const newTransactions = response.data.added.map((transaction) => ({
          id: transaction.transaction_id,
          name: transaction.name,
          paymentChannel: transaction.payment_channel,
          type: transaction.amount > 0 ? 'debit' : 'credit',
          accountId: transaction.account_id,
          amount: Math.abs(transaction.amount),
          pending: transaction.pending,
          category: transaction.category ? transaction.category[0] : "",
          date: transaction.date,
          image: transaction.logo_url || null,
        }));

        transactions = [...transactions, ...newTransactions];
        hasMore = data.has_more;
        
        console.log('Sync cursor update - Added:', newTransactions.length, 'Has more:', hasMore);
      }

      return parseStringify(transactions);
    }
  } catch (error: any) {
    console.error("Error fetching transactions:", error.response?.data || error);
    return [];
  }
};

// Create Transfer
export const createTransfer = async () => {
  const transferAuthRequest: TransferAuthorizationCreateRequest = {
    access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
    account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
    funding_account_id: "442d857f-fe69-4de2-a550-0c19dc4af467",
    type: "credit" as TransferType,
    network: "ach" as TransferNetwork,
    amount: "10.00",
    ach_class: "ppd" as ACHClass,
    user: {
      legal_name: "Anne Charleston",
    },
  };
  try {
    const transferAuthResponse =
      await plaidClient.transferAuthorizationCreate(transferAuthRequest);
    const authorizationId = transferAuthResponse.data.authorization.id;

    const transferCreateRequest: TransferCreateRequest = {
      access_token: "access-sandbox-cddd20c1-5ba8-4193-89f9-3a0b91034c25",
      account_id: "Zl8GWV1jqdTgjoKnxQn1HBxxVBanm5FxZpnQk",
      description: "payment",
      authorization_id: authorizationId,
    };

    const responseCreateResponse = await plaidClient.transferCreate(
      transferCreateRequest
    );

    const transfer = responseCreateResponse.data.transfer;
    return parseStringify(transfer);
  } catch (error) {
    console.error(
      "An error occurred while creating transfer authorization:",
      error
    );
  }
};