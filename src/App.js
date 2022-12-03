import React, { useState } from "react";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { Provider, Signer } from "@reef-defi/evm-provider";
import { WsProvider } from "@polkadot/rpc-provider";
import { Contract } from "ethers";
import GreeterContract from "./contracts/Greeter.json";
import Uik from "@reef-defi/ui-kit";
import styled from 'styled-components'
import Main from "./screens/Main";

const FactoryAbi = GreeterContract.abi;
const factoryContractAddress = GreeterContract.address;

const URL = "wss://rpc-testnet.reefscan.com/ws";

const Wrapper = styled.div`
	min-height: 100vh;
	/* width: clamp(300px, 75%, 800px) !important; */
	background: linear-gradient(90deg, #170B3B 0%, #0E050F 100%);
	padding: 30px;
`

const LeftContent = styled.div`
	
`

const RightContent = styled.div`
	margin: auto 0;
`

const Header = styled.div`
	display: flex;
	justify-content: space-between;
`

const MainContent = styled.div`
	max-width: 510px;
	width: 100%;
	border: 1px solid white;
	padding: 20px;
	margin: 100px auto;
	// filter: blur(2px);
	// backdrop-filter: blur(16px) saturate(180%);
    // -webkit-backdrop-filter: blur(16px) saturate(180%);
    background: linear-gradient(90deg, #695E93 0%, #695E80 100%);
    border-radius: 12px;
    border: 1px solid;
`

function App() {
	const [msgVal, setMsgVal] = useState("");
	const [msg, setMsg] = useState("");
	const [signer, setSigner] = useState();
	const [isWalletConnected, setWalletConnected] = useState(false);
	const [evmAddress, setEvmAddress] = useState('')

	const checkExtension = async () => {
		let allInjected = await web3Enable("Reef");

		if (allInjected.length === 0) {
			return false;
		}

		let injected;
		if (allInjected[0] && allInjected[0].signer) {
			injected = allInjected[0].signer;
		}

		const evmProvider = new Provider({
			provider: new WsProvider(URL),
		});

		evmProvider.api.on("ready", async () => {
			const allAccounts = await web3Accounts();

			allAccounts[0] &&
				allAccounts[0].address &&
				setWalletConnected(true);

			console.log(allAccounts);

			const wallet = new Signer(
				evmProvider,
				allAccounts[0].address,
				injected
			);
			try{
				const evmAddress = await wallet.getAddress()
				setEvmAddress(evmAddress)
			} catch(e){
				console.log("error in fetching evm address", e)
			}
			
			// Claim default account
			if (!(await wallet.isClaimed())) {
				console.log(
					"No claimed EVM account found -> claimed default EVM account: ",
					await wallet.getAddress()
				);
				await wallet.claimDefaultAccount();
			}

			setSigner(wallet);
		});
	};

	const checkSigner = async () => {
		if (!signer) {
			await checkExtension();
		}
		return true;
	};

	const getGreeting = async () => {
		await checkSigner();
		const factoryContract = new Contract(
			factoryContractAddress,
			FactoryAbi,
			signer
		);
		const result = await factoryContract.greet();
		setMsg(result);
	};

	const setGreeting = async () => {
		await checkSigner();
		const factoryContract = new Contract(
			factoryContractAddress,
			FactoryAbi,
			signer
		);
		await factoryContract.setGreeting(msgVal);
		setMsgVal("");
		getGreeting();
	};

	return (
		<Wrapper>
				<Header>
					<LeftContent>
						<Uik.Text text="Automata Transaction" type="headline" />
					</LeftContent>
					<RightContent>
						<Uik.Button
							text={isWalletConnected ? evmAddress : "Connect Wallet"}
							onClick={checkExtension}
							iconPosition={'center'}
						/>
					</RightContent>
				</Header>
				<MainContent>
					<Main />
				</MainContent>
		</Wrapper>
	);
}

export default App;
