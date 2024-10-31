const Token = artifacts.require('./Token');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Token', (acccounts)=>{
    describe('deployment', ()=>{
        it('tracks the name', async () => {
            const token = await Token.new();
            const result = await token.name();

            result.should.equal('Rejwan');
            
        })
    })
});