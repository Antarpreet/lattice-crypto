# lattice-crypto

A Lattice based cryptography library for JS using Kyber, NewHope, Frodo, Lizard, and Ring-Lizard algorithms. (Under Development)


## New Hope example
We are changing this to be database storable and will become generic.

(Generic)
New Hope Key Exchange:
```
  const newHopeAlice = new NewHope();
  newHopeAlice.generateKeyPair();
  const sharedRandomness = newHopeAlice.sharedRandomness;

  const newHopeBob = new NewHope();
  newHopeBob.sharedRandomness = sharedRandomness;
  newHopeBob.generateKeyPair();

  const aliceShared = newHopeAlice.generateSharedSecret(newHopeBob.publicKey);
  newHopeBob.vector = newHopeAlice.vector;

  const bobShared = newHopeBob.generateSharedSecret(newHopeAlice.publicKey);

  console.log('Alice');
  console.log(aliceShared.toString());
  console.log('Bob');
  console.log(bobShared.toString());
  if (aliceShared.toString() === bobShared.toString()) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
``` 