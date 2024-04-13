For the repo containing the Munus smart contract, go to: https://github.com/hackaugusto/munus

# MUNUS: _Anonymous Donations_, by JAUF

Munus allows anonymous donations to charities. It utilizes [Firn](https://firn.cash) to decouple the address of the donator from the transaction to the charity. The donator can at any point in time reveal the secret used to hash the transaction data in order to prove that they did indeed perform the donation. This can be useful for tax returns or other situations where it might be necessary to prove that a donation was done.

### How it works

- Prerequisite: User has funds on Firn (currently only Base supported)
- User connects to Munus website with Metamask using the Firn Snap
- User selects address of charity and donation amount and hashes it with a secret
- Firn Snap creates proof for transaction and calls the Munus smart contract
- Munus smart contract registers the hash of the tx and forwards the funds to the charity
- User can at any point in time show that he did the transaction buy revealing the secret (currently a "one of" event)

### Future improvement

- Charity registration / KYC to assure charities receive money
- zkp for the donation proof in order to choose who to reveal to
- Automatic donation receipt generator
