const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const fs = require('fs/promises');
const exec = require('child_process').exec;

describe("PublicRandomService", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();
    const Service = await ethers.getContractFactory("PublicRandomService");
    const Demo = await ethers.getContractFactory("Demo");
    const service = await Service.deploy();
    const demo = await Demo.deploy( service.address );
    return { owner, otherAccount, service, demo };
  }

  it("Check Entrophy", async function () {
    function toChars( bignumber ) {
      bignumber = BigInt( bignumber );
      var ret = [];
      while( bignumber > BigInt(0) )
      {
        var c = Number( bignumber % BigInt(256) );
        bignumber /= BigInt(256);
        ret.push( String.fromCharCode(c) );
      }
      return ret;
    }
    const {owner, otherAccount, service} = await loadFixture(deploy);
    const CNT = 1000;
    var old = 0;
    var generated = [];
    await fs.writeFile('seeds.out', '');
    for( var i = 0 ; i < CNT ; i++ ) {
      const resp = await service.rand( 0 );
      const txreceipt = await resp.wait();
      await fs.appendFile( "seeds.out", toChars(await service._seed()).join('') );
    }
    var entTest = new Promise( (resolve, reject) => {
      exec("tools/ent seeds.out", function( error, stdout, stderr ) {
        resolve( stdout );
      } );
    } );
    var tmp = await entTest;
    console.log( tmp );
  } );

  it("Gas Cost 1000", async function () {
    const {owner, otherAccount, service} = await loadFixture(deploy);
    const CNT = 1000;
    var oldBalance = await owner.getBalance();
    for( var i = 0 ; i < CNT ; i++ ) {
      await service.rand( i+1 );
    }
    var newBalance = await owner.getBalance();
    var avgCost = (oldBalance - newBalance) / CNT;
    console.log( `Average Gas Cost: ${avgCost}` );
  });

  it("Test Win", async function() {
    const {owner, demo} = await loadFixture(deploy);
    const CNT = 1000;
    for( var i = 0 ; i < CNT ; i++ ) {
      await demo.lottery();
    }
    var wins = Number( await demo.wins( owner.address ) )
    console.log( wins );
    expect( Math.abs(wins - CNT / 2) / CNT < 0.03 ).to.equal( true )
  } );


});
