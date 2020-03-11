'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');
var bsv = require('bsv');

describe('boost #BoostPowJob create various getters and setters', () => {

   it('should be valid minimal', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: Buffer.from('00000000000000000000000000000000000000000068656c6c6f20776f726c64', 'hex').toString('hex'),
         diff: 157416.40184364,
         category: "00000000",
         tag: '0000000000000000000000000000000000000000',
         metadata: "0000000000000000000000000000000000000000000000000000000000000000",
         unique: "0000000000000000",
      })
   });

   it('should output script compatible with MB and Relay', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });

      const jobObj = job.toASM();
      expect(jobObj).to.eql('31307674736f6f62 OP_DROP 00000000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 0000000000000000000000000000000000000000 0000000000000000 0000000000000000000000000000000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should be valid full', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
         // Optional fields below
         category: '04d2',
         tag: 'animals',
         metadata: 'metadata here',
         // Optional and auto-generated
         unique: '00000000913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('metadata here', 32).reverse().toString('hex'),
         unique: '00000000913914e3',
      });

      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });
   });

   it('should be valid full from object with hex fields', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: index.BoostUtilsHelper.createBufferAndPad('hello world', 32).reverse().toString('hex'),
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('metadata here', 32).reverse().toString('hex'),
         unique: '00000000913914e3',
      });

      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });
   });

   it('should generate output script Hex', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const outputScript = job.toHex();
      expect(outputScript).to.eql('0831307674736f6f6275043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000008e314399100000000206572656820617461646174656d000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88ac');

      const jobFromHex = index.BoostPowJob.fromHex(outputScript);

      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(outputScript).to.eql('0831307674736f6f6275043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000008e314399100000000206572656820617461646174656d000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88ac');
   });


   it('should generate output script toString', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '0132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(outputScript).to.eql('8 0x31307674736f6f62 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should generate output script ASM', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      // Why the HECK does toString() work for fromASM, but toASM into fromASM does not?? Argghhh! bsv.js!
      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromASM(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(outputScript).to.eql('8 0x31307674736f6f62 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
      expect(job.toASM()).to.eql('31307674736f6f62 OP_DROP 32010000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e314399100000000 6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should generate same formatted bits as bitcoin block 0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });


      expect(outputScript).to.eql('8 0x31307674736f6f62 OP_DROP 4 0x01000000 32 0x9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should return error for too large and invalid values. content', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '330000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 157416.40184364,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: content too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. diff', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: null,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: diff must be a number starting at 1. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. category', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '2300000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: category too large. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. tag', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '3200000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: tag too large. Max 20 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. metadata', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '33000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: metadata too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. unique', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '3300000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: unique too large. Max 8 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
});


describe('boost #BoostPowString tryValidateJobProof', () => {

   it('tryValidateJobProof failure with sample data', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         unique: '00000000913914e3',
      });

      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '00',
         time: '4dcbc8a6',
         minerNonce: '00000000913914e3',
         minerAddress: '00',
      });

      const result = index.BoostPowJob.tryValidateJobProof(job, jobProof);

      expect(result).to.eql(null);
   });

});

describe('BoostPowJob', () => {
   it('should correctly load from fromTransaction', async () => {
      const job = index.BoostPowJob.fromTransaction(new bsv.Transaction('0100000001c57af713fdd0750ea6556fef16ba58c6fd7946b6a6600163b84303a6047d2ab9010000006a4730440220302c22161af7d29186d420477b5f41329c470fadd43750944e094be69f39cab802204259cff79fb9a6b0947363ac6c9da6e607436f5c5acda931db0c908d3633ee71412102b618dda1256faf611127bbe9f213a00b74014740712fd2c4bac2647a9603e26effffffff0240420f0000000000d40831307674736f6f627504000000002074736f6f42206f6c6c654800000000000000000000000000000000000000000004ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88aca3055f0e000000001976a914ac04bc2ddd762c0fae2d2756f6d673899366cd3588ac00000000'));
      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000048656c6c6f20426f6f7374',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000',
      });
   });
});

describe('BoostPowJob', () => {
   it('should correctly load from fromTransaction', async () => {
      const job = index.BoostPowJob.fromRawTransaction('0100000001c57af713fdd0750ea6556fef16ba58c6fd7946b6a6600163b84303a6047d2ab9010000006a4730440220302c22161af7d29186d420477b5f41329c470fadd43750944e094be69f39cab802204259cff79fb9a6b0947363ac6c9da6e607436f5c5acda931db0c908d3633ee71412102b618dda1256faf611127bbe9f213a00b74014740712fd2c4bac2647a9603e26effffffff0240420f0000000000d40831307674736f6f627504000000002074736f6f42206f6c6c654800000000000000000000000000000000000000000004ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88aca3055f0e000000001976a914ac04bc2ddd762c0fae2d2756f6d673899366cd3588ac00000000');
      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000048656c6c6f20426f6f7374',
         diff: 1,
         category: '00000000',
         tag: '0000000000000000000000000000000000000000',
         metadata: '0000000000000000000000000000000000000000000000000000000000000000',
         unique: '0000000000000000',
      });
   });
});


describe('BoostPowJob', () => {
   it('should correctly set txid if provided from all loaders', async () => {
      let job

      job = index.BoostPowJob.fromRawTransaction('0100000001c57af713fdd0750ea6556fef16ba58c6fd7946b6a6600163b84303a6047d2ab9010000006a4730440220302c22161af7d29186d420477b5f41329c470fadd43750944e094be69f39cab802204259cff79fb9a6b0947363ac6c9da6e607436f5c5acda931db0c908d3633ee71412102b618dda1256faf611127bbe9f213a00b74014740712fd2c4bac2647a9603e26effffffff0240420f0000000000d40831307674736f6f627504000000002074736f6f42206f6c6c654800000000000000000000000000000000000000000004ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88aca3055f0e000000001976a914ac04bc2ddd762c0fae2d2756f6d673899366cd3588ac00000000');
      expect(job.getTxOutpoint()).to.eql({
         txid: 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301',
         vout: 0,
         value: 1000000,
      });

      index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         unique: '00000000913914e3',
      }, 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301', 0)

      expect(job.getTxOutpoint()).to.eql({
         txid: 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301',
         vout: 0,
         value: 1000000
      });

      job = index.BoostPowJob.fromASM('8 0x31307674736f6f62 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG', 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301', 1, 123)

      expect(job.getTxOutpoint()).to.eql({
         txid: 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301',
         vout: 1,
         value: 123
      });

      expect(job.getTxid()).to.eql('debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301');
      expect(job.getVout()).to.eql(1);

      job = index.BoostPowJob.fromASM('8 0x31307674736f6f62 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG', 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301')

      expect(job.getTxOutpoint()).to.eql({
         txid: 'debbd830e80bdccf25d8659b98e8f77517fe0af4c5c161d645bf86a4e7fcd301',
         vout: undefined,
         value: undefined
      });

      job = index.BoostPowJob.fromASM('8 0x31307674736f6f62 OP_DROP 4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG')

      expect(job.getTxOutpoint()).to.eql({
         txid: undefined,
         vout: undefined,
         value: undefined
      });

      expect(job.getTxid()).to.eql(undefined);
      expect(job.getVout()).to.eql(undefined);
      expect(job.getValue()).to.eql(undefined);

   });

   it('should correctly get content and buffers as appropriate', async () => {
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('this is more metadata', 32).reverse().toString('hex'),
         unique: index.BoostUtilsHelper.createBufferAndPad('01c8', 8).reverse().toString('hex')
      });

      expect(job.getScriptHash()).to.eql('68f7e09876f65fd826d46c0cfa5f09c27183c2f5d74ce55604a15932432376a6');
      expect(job.getId()).to.eql('68f7e09876f65fd826d46c0cfa5f09c27183c2f5d74ce55604a15932432376a6');
      expect(job.getDiff()).to.eql(21);
      expect(job.getUniqueBuffer().toString('hex')).to.eql('c801000000000000');
      expect(job.getUniqueHex()).to.eql('00000000000001c8');
      expect(job.getUnique()).to.eql(456);

      expect(job.getContentString()).to.eql('hello animal');
      expect(job.getContentBuffer().toString('hex')).to.eql('6c616d696e61206f6c6c65680000000000000000000000000000000000000000');
      expect(job.getContentHex()).to.eql('000000000000000000000000000000000000000068656c6c6f20616e696d616c');

      expect(job.getTagString()).to.eql('this is a tag');
      expect(job.getTagBuffer().toString('hex')).to.eql('6761742061207369207369687400000000000000');
      expect(job.getTagHex()).to.eql('0000000000000074686973206973206120746167');

      expect(job.getCategoryString()).to.eql('bill');
      expect(job.getCategoryBuffer().toString('hex')).to.eql('6c6c6962');
      expect(job.getCategoryHex()).to.eql('62696c6c');

      expect(job.getMetadataString()).to.eql('this is more metadata');
      expect(job.getMetadataBuffer().toString('hex')).to.eql('617461646174656d2065726f6d20736920736968740000000000000000000000');
      expect(job.getMetadataHex()).to.eql('000000000000000000000074686973206973206d6f7265206d65746164617461');

      expect(job.toString()).to.eql('8 0x31307674736f6f62 OP_DROP 4 0x6c6c6962 32 0x6c616d696e61206f6c6c65680000000000000000000000000000000000000000 4 0xb6300c1c 20 0x6761742061207369207369687400000000000000 8 0xc801000000000000 32 0x617461646174656d2065726f6d20736920736968740000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');

   });

   it('should correctly get bits and target and category number', async () => {
      let job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 1,
         category: Number(123).toString(16),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('this is more metadata', 32).reverse().toString('hex'),
         unique: index.BoostUtilsHelper.createBufferAndPad('01c8', 8).reverse().toString('hex')
      });

      expect(job.getBits()).to.eql(486604799);
      expect(job.getCategoryNumber()).to.eql(123);
      expect(job.getUniqueNumber()).to.eql(456);

      job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad('hello animal', 32).reverse().toString('hex'),
         diff: 409786762471.9213,
         category: Number(123).toString(16),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('this is more metadata', 32).reverse().toString('hex'),
         unique: index.BoostUtilsHelper.createBufferAndPad('01c8', 8).reverse().toString('hex')
      });
      // 1802b20b
      expect(job.getDiff()).to.eql(409786762471.9213);
      expect(job.getBits()).to.eql(402829022);
      expect(job.getBitsHex()).to.eql('1802aede');
   });


   it('should correctly get content and buffers as appropriate capitalists', async () => {
      const hashed = index.BoostUtilsHelper.getSha256('Capitalists can spend more energy than socialists.');
      const job = index.BoostPowJob.fromObject({
         content: index.BoostUtilsHelper.createBufferAndPad(hashed, 32).toString('hex'),
         diff: 21,
         category: index.BoostUtilsHelper.createBufferAndPad('bill', 4).reverse().toString('hex'),
         tag: index.BoostUtilsHelper.createBufferAndPad('this is a tag', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('this is more metadata', 32).reverse().toString('hex'),
         unique: index.BoostUtilsHelper.createBufferAndPad('01c8', 8).reverse().toString('hex')
      });
      expect(job.getContentHex()).to.eql('35b8fcb6882f93bddb928c9872198bcdf057ab93ed615ad938f24a63abde5881');

   });


});