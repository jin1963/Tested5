let web3;
let contract;
let accounts;

const contractAddress = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
const tokenAddress = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(stakingABI, contractAddress);
        document.getElementById("walletAddress").innerText = accounts[0];
    } else {
        alert("Please install MetaMask");
    }
});

document.getElementById("connectButton").onclick = async () => {
    await ethereum.request({ method: 'eth_requestAccounts' });
    accounts = await web3.eth.getAccounts();
    document.getElementById("walletAddress").innerText = accounts[0];
};

document.getElementById("stakeButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    const duration = document.getElementById("tierSelect").value;
    const amountWei = web3.utils.toWei(amount, "ether");

    const token = new web3.eth.Contract([
        { "constant": false, "inputs": [{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}], "name": "approve", "outputs": [], "type": "function" }
    ], tokenAddress);

    await token.methods.approve(contractAddress, amountWei).send({ from: accounts[0] });
    await contract.methods.stake(amountWei, duration).send({ from: accounts[0] });
    alert("Stake Success");
};

document.getElementById("claimButton").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.claim(index).send({ from: accounts[0] });
    alert("Claim Success");
};

document.getElementById("unstakeButton").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.unstake(index).send({ from: accounts[0] });
    alert("Unstake Success");
};
