// Have a function to enter the lottery
// Using useWeb3Contract from Moralis
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    // Header passes up all the Metamask info to the MoralisProvider
    // the MoralisProvider then passes it down to all the components
    // inside the MoralisProvider tags
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    // How to format the hex chain id number into a integer
    console.log(parseInt(chainIdHex))

    const dispatch = useNotification()

    //runContractFunction can both send transaction and read state
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        // Only want to try and get the entrance fee if web3IsEnabled
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee
            // to do this just use useWeb3Contract again
            // remember that they are async functions though

            updateUI()
        }
    }, [isWeb3Enabled])
    // isWeb3Enabled needs to be in dependency array because it probably starts
    // as false and then updates to true as the page renders so we need to run this
    // useEffect again to get it to actually find the entranceFee

    // When the contract call is successful it does pass it a tx parameter
    const handleSuccess = async (tx) => {
        await tx.wait(1)
        updateUI()
        handleNewNotification(tx)
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            Hi from lottery entrance
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            // these functions come with onSuccess, onComplete, onError etc.
                            await enterRaffle({
                                // checks to see a transaction is successfully sent to Metamask
                                // thats why theres tx.wait(1) in the functions
                                // thats the piece that actually waits for the transaction to be confirmed
                                onSuccess: handleSuccess,
                                // always want to add this onError to all contract function calls
                                // (i.e run contract functions)
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee:{" "}
                        {ethers.utils.formatUnits(entranceFee, "ether")}
                    </div>
                    <div>Number of Players : {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    )
}
