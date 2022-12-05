function getTilled(account_id, public_key) {
    const tilledAccountId = account_id
    const tilled = new window.Tilled(
        public_key, 
        tilledAccountId, 
        { 
        sandbox: true,
        log_level: 0 
        }
    )
    
    console.log('You got Tilled')
    return tilled
}

export default getTilled