import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    // useMoralis is Moralis' version of useState?
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        // just checks to see if Metamask is open
        isWeb3EnableLoading,
    } = useMoralis()
    // enableWeb3 is like await ethereum.request({method: "eth_requestAccounts"})
    // works initially just on Metamask

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefine") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...
                    {account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()

                        // connected is key and value is injected
                        // injected refers to Metamask being injected web3
                        // do it like this so you can add coinbase wallet
                        // and such afterwards as separate values
                        // just ensuring theres a window (since Nextjs struggles with it sometimes)
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

// I'm going to show you the hard way first
// Then the easy way
