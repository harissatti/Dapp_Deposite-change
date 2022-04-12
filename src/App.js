  import React,{useState,useEffect} from "react";
  import {ethers, Signer} from "ethers";

  function App() {
    const [greet,setGreet]=useState('');
    const[balance,setbalance]=useState(0);
    const [depositevalue,setDepositevalue]=useState('');
    const[greetingvalue,setgreetingvalue]=useState('');

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3"



// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "deposite",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "greet",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_greeting",
        "type": "string"
      }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// The Contract object
const contract = new ethers.Contract(contractAddress,ABI,signer);


  useEffect(()=>{
      const connectWallet=async()=>{
          // MetaMask requires requesting permission to connect users accounts
      await provider.send("eth_requestAccounts", []);
  }

      const getBalance=async()=>{
        const balance=await provider.getBalance(contractAddress);
        const balanceFormate=ethers.utils.formatEther(balance); 
        setbalance(balanceFormate);

      }

      const getGreeting=async()=>{
        const greeting=await contract.greet();

        setGreet(greeting);
      }

      connectWallet();
      getBalance();
    getGreeting();

  })

    
    
  


    const handleDepositChange=(e)=>{
      setDepositevalue(e.target.value);
  }
    const handleGreetingChange=(e)=>{
      setgreetingvalue(e.target.value);

    }

    const handelDepositeSubmit=async(e)=>{
      e.preventDefault();
      console.log(depositevalue);
      const ethvalue=ethers.utils.parseEther(depositevalue); 
      const depositeth=await contract.deposite({value:ethvalue});
      await depositeth.wait();

      const balance=await provider.getBalance(contractAddress);
      const balanceFormate=ethers.utils.formatEther(balance); 
      setbalance(balanceFormate);
    }

    const handelGreetingSubmit=async(e)=>{
      e.preventDefault();
   const greetingupdate= await contract.setGreeting(greetingvalue);
   await greetingupdate.wait();
    setGreet(greetingvalue);
    setgreetingvalue('');

    }
    return (
      <div className="container">
        <div className="container">
          <div className="row">
            <div className="col mt-5">
              <h5>{greet}</h5>
              <h6>Contract Balance :{balance}</h6>
            </div>
            <div className="col">
              <form className="mt-5" onSubmit={handelDepositeSubmit}>
                <div className="mb-3">
                  <input type="number" className="form-control" placeholder="0" value={depositevalue} onChange={handleDepositChange} />
                </div>
                <button type="submit" className="btn btn-primary">deposite</button>
              </form>
              <form className="mt-5" onSubmit={handelGreetingSubmit}>
                <div className="mb-3">
                  <input type="text" className="form-control" value={greetingvalue} onChange={handleGreetingChange} />
                </div>
                <button type="submit" className="btn btn-primary">change</button>

              </form>

            </div>

          </div>
        </div>
      </div>
    );
  }

  export default App;
