import { ConnectButton } from "web3uikit"
import styles from "./Header.module.scss"

export default function Header() {
    return (
        <div className={`border-b-2 flex flex-row ${styles.header}`}>
            {/* MoralisAuth is if we want to connect to a server*/}
            <h1 className="py-4 px-4 font-blog text-3xl">
                Blockchain Decentralized Lottery
            </h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
