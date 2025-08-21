import React from 'react'
import HeaderBox from '../../components/HeaderBox'
import TotalBalanceBox from '../../components/TotalBalanceBox';
import RightSideBar from '@/components/RightSideBar';

const Home = () => {
    const loggedIn = {firstName: "James",
                      lastName: "Doe",
                      email: "jDoe@tufts.edu"};
    return (
        <section className="home ">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox 
                    type="greeting"
                    title="Welcome"
                    user={loggedIn?.firstName || "Guest"}
                    subtext="Access and manage your account and transactions"
                    />
                
                    <TotalBalanceBox
                    accounts={[]}
                    totalBanks={1}
                    totalCurrentBalance={1215.35}
                    />
                </header>

                RECENT TRANSACTIONS
            </div>

            <RightSideBar 
                user={loggedIn}
                transactions={[]}
                banks={[{currentBalance: 125.50}, {currentBalance: 242.87}]}
            />
        </section>
    )
}

export default Home