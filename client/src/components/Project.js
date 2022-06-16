import React, {useState, useEffect} from 'react';
import { stackAbi , stackAddress, rewardAbi, rewardTokenAddress } from "../utils/constant";
import {shortenAddress} from "../utils/shortenAddress";
import {ethers} from "ethers";

const {ethereum} = window;

function Project() {
    const [account, setAccount] = useState();
    const [connected, setConnected] = useState(false);
    const [stackValue,setStackValue] = useState("");

    const [balance, setBalance] = useState("0");
    const [rtBalance, setRtBalance] = useState("0");
    const [stackAmount, setStackAmount] = useState("0");
    const [earnedAmount, setEarnedAmount] = useState("0");

    const connectWallet = async () => {
        try {
            if (!ethereum) alert("Install metamask");

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setAccount(accounts[0]);

            const provider = new ethers.providers.Web3Provider(ethereum)
            const bal = await provider.getBalance(account);

            setBalance(bal.toString());
        } catch (error) {
            console.error(error);

            throw new Error("No ethereum object");
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) alert("Install metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setAccount(accounts[0]);
                setConnected(true);
            }
            else {
                console.error("No accounts found");
            }
        } catch (error) {
            console.error(error);

            throw new Error("No ethereum object");
        }
    }

    const createStackContract = () =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const transactionsContract = new ethers.Contract(stackAddress, stackAbi, signer);

        return transactionsContract;
    } 
    
    const createRtContract = () =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const RtContract = new ethers.Contract(rewardTokenAddress, rewardAbi, signer);

        return RtContract;
    } 


    const findamount = async () => {
        const StackContract = createStackContract();

        const rtBalanceContract = createRtContract();

        const rtBal = await rtBalanceContract.balanceOf(account);

        setRtBalance(ethers.utils.formatUnits(rtBal.toString(),"ether"));

        const stacked = await StackContract.getStaked(account);

        setStackAmount(ethers.utils.formatUnits(stacked.toString(),"ether"));
        
        const earned = await StackContract.s_rewards(account);
        setEarnedAmount(ethers.utils.formatUnits(earned.toString(), "ether"));
    }

    
    useEffect(() => {
        checkIfWalletIsConnected();
        if (connected) {
            connectWallet();
            findamount();
        }
    }, [connected, stackAmount, earnedAmount]);
    
    const changeStack = (e) =>{
        e.preventDefault();
        const val= e.target.value;
        setStackValue(val);
    }

    const stackButton = async () =>{
        const rtContract = createRtContract();
        const StackContract = createStackContract();

        const stackedValue = ethers.utils.formatUnits(stackValue.toString(),"ether");

        const rtSuccess = await (await rtContract.approve(stackAddress, stackValue)).wait();
        if(!rtSuccess){
            alert("Approval Failed due to some reason");
        }
        const success = await (await StackContract.stack(stackValue)).wait();

        if(!success){
            alert("Transaction Failed due to some reason");
            return;
        }
        else{
            console.log("success");
            findamount();
        }
    }

    return (
        <div>
            <nav className="navbar">
                <div className="logo">Krypto</div>
                <div>
                    {!account ?
                        (<button className='btn btn-wallet' onClick={connectWallet}>Connect</button>
                        )
                        : (
                            <a href={`https://ropsten.etherscan.io/address/${account}`}
                                target="_blank">
                                <button className='btn btn-wallet'>
                                    {shortenAddress(account)}
                                </button>

                            </a >
                        )
                    }
                </div>
            </nav>

            <div>
                <p>Total balance this account has: {balance}</p>
                <p>Total Reward Token this account has: {rtBalance}</p>
                <p>Stack amount this account staked: {stackAmount}</p>
                <p>Earned profit this account earned: {earnedAmount}</p>

                <input type="number" name="Stacking Amount" value={stackValue} onChange={changeStack} placeholder='Enter amount to Stack'/>

                <button className='btn' onClick={stackButton}>Submit</button>

            </div>
        </div>
    )
}

export default Project