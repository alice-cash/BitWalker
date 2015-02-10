# BitWalker
Javascript Bit manipulation class.

<p>
What does it do? It won't make you breakfast or wash your 
car however it will allow you to edit and walk through a 
Byte array at the bit level. This will ease certian tasks
such as extracting colors from an 8 bit color value or
converting values between radixes for values larger than 
what parseInt() will support.
</p>

#Why?
What is the purpose of this class? What does it do? Normally bit access in JavaScript is somewhat limited. All numbers are treated as 64 bit numbers however Bitwise operationsactually only work on the first 32 bits. With this there is no direct way to only have a single 8 bit value. Javascript does provide Uint8Array() however this is still somewhat limited in what can be performed or how it can be accessed. It does emulate Byte values as any data after the first 8 bits is dropped when seting data.

I was actually looking for a somewhat more robust Radix conversion than what parseInt() provides. The primary limitations with this is that if you give parseInt a value such as 0x0044 it will only show the "68" and hides the fact that there are almost 26 bits of data missing. In most cases we may not care about the remaining data however I infact did care. Dammit. 

An example of a Lossless Radix converter can be found in the #Examples

#Avalable functions

BitWalker is initilized with a provided Length. This length is in Bytes and so if needed, multiply your bit requirement by 8 and round up. BitWalker must be initated with the *new* keyword, failure to do so will result in an exception being thrown.

The 2 primary functions avalable are GetBits and SetBits which
have the following paramters:
```JavaScript
GetBits(Position,Width);
SetBits(Position,Width,Value);
```
Position is the Bit position in the array. Width is the number of bits to retrive. Positon must be a value between 0 and the length of the array in bits. Width must be between 1 and 8. If more bits are needed the walk functions below can be used. An example is provided at the end.

When SetBits is used, only the first n bits are saved as equal to the width provided. If for example you provide a width of 4 and a value of 0xF0, it will only write the first 4 0 bits and ignore the last 4 1 bits.

There are 5 aditional functions avalable for which the class gets its name:
````JavaScript
 WalkGet();
 WalkPut(Value);
 StandGet();
 StandPut(Value);
 Walk();
```

WalkGet, WalkPut, and Walk advance the position in the queue whereas StandGet and StandPut do not modify the position.

These are further controled by the following Properties:
```JavaScript
 Stride: getStride(), setStride(Value)
 StrideWidth: getStridWidth(), setStrideWidth(Value)
 StridePosition: getStridePosition, setStridePosition(Value)
 StrideReset();
```

Stride represents how many bits we jump after a Walk function.<br/>
StrideWidth represents how many bits we read.<br/>
StridePosition represents where in the array we are. This is advanced with each Walk function call by the current Stride value.

StrideReset simply resets the position back to 0.

Stride and StrideWidth are by default locked to the same value and must be unlocked to allow changing them seperatly. When they are locked, changes to one are pushed to the other. This provides simpler Stride changes when you wish to read the full stride length.

When StrideWidth is locked, Stride must be a number between 1 and 8. When unlocked Stride can be any size under the total length of the Bit array.<br/>
StrideWidth can only be set to a value between 1 and 8.<br/>

The following functions are provided to control the lock:
```
UnLockStrideWidth();
LockStrideWidth();
StrideWidthLocked();
```

StrideWidthLocked returns if they are currently locked.

If the StrideWidth is locked, the Stride is set to StrideWidth. This is to
prevent any issues of StrideWidth becoming greater than 8.


#Examples

(Coming Soon)

