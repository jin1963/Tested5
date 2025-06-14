let web3;
let contract;
let accounts = [];

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(stakingABI, contractAddress);
        document.getElementById("walletAddress").innerText = accounts[0];
    } else {
        alert("Please install MetaMask!");
    }
});

document.getElementById("stakeButton").onclick = async () => {
    const amount = document.getElementById("amountInput").value;
    const tier = document.getElementById("tierSelect").value;
    if (!amount || parseFloat(amount) <= 0) {
        alert("Please enter valid amount");
        return;
    }
    const token = new web3.eth.Contract(
      [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[],"type":"function"}], tokenAddress);
    await token.methods.approve(contractAddress, web3.utils.toWei(amount, "ether")).send({from: accounts[0]});
    await contract.methods.stake(web3.utils.toWei(amount, "ether"), tier).send({ from: accounts[0] });
    alert("✅ Stake Success!");
};

document.getElementById("claimButton").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.claim(index).send({ from: accounts[0] });
    alert("✅ Claimed!");
};

document.getElementById("unstakeButton").onclick = async () => {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.unstake(index).send({ from: accounts[0] });
    alert("✅ Unstaked!");
};
