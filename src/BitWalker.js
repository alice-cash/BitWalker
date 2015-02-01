/**
  @copyright
  Copyright 2015, Matthew Cash <matthew@stormstudios.org>. All rights reserved.
  URL: https://github.com/masshuku/BitWalker/
  URL: http://stormstudios.org/BitWalker/
  
 
 Redistribution and use in source and binary forms, with or without modification, are
 permitted provided that the following conditions are met:
 
    1. Redistributions of source code must retain the above copyright notice, this list of
       conditions and the following disclaimer.
 
    2. Redistributions in binary form must reproduce the above copyright notice, this list
       of conditions and the following disclaimer in the documentation and/or other materials
       provided with the distribution.
 
 THIS SOFTWARE IS PROVIDED BY Matthew Cash ``AS IS'' AND ANY EXPRESS OR IMPLIED
 WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Matthew Cash OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 The views and conclusions contained in the software and documentation are those of the
 authors and should not be interpreted as representing official policies, either expressed
 or implied, of Matthew Cash.

 */

/**
 Version: 1.0
*/


/**
 * Initializes a new BitWalker class. This class allows for quick Bit manipulation and allows you
 *     to walk through the array via the {@link BitWalker.Walk} and {@link BitWalker.WalkPut} 
 *     functions. 
 * 
 * @param {number} ByteArrayLength: The number of bytes in this array. Must be greater than 0.
 * @constructor 
 */
function BitWalker(ByteArrayLength) {
    ByteArrayLength = Number(ByteArrayLength) || 0;

    if (Length <= 0)
        throw new Error("Length must be a number greater than 0");

    /* 
      This is a test to ensure the function is called with the "New" Keyword.
      If someone assigns the function as a property of its self this won't catch
      it but then, really. WTF are they doing??? WHY?
     */
    if (this.constructor != BitWalker)
        throw new Error("This must be called via the 'New' keyword.");

    var BitArray = new Uint8Array(ByteArrayLength);
    var Length = ByteArrayLength;
    var BitLength = ByteArrayLength * 8;
    var Stride = 8;
    var StrideWidth = 8;
    var LockStrideWidth = true;
    var StridePos = 0;

    /**
    * Retrieve the number of bytes in our Array.
    * @type {number}
    */
    BitWalker.prototype.getLength = function () {
        return Length;
    }

    /**
    * Retrieve the number of bits in our Array.
    * @type {number} 
    */
    BitWalker.prototype.getBitLength = function () {
        return BitLength;
    }

    /**
    * Sets our stride. This is how many bits are advanced after a walk function.
    * @type {number}
    */
    BitWalker.prototype.getStride = function () {
        return Stride;
    }

    /**
    * Sets our stride. This controls how many bits are advanced after a walk function. If StrideWifth is locked
    *     this will also update Stride.
    * @param newStride The new width to use. This must be between 1 and 8 when StrideWidth is locked. When unlocked
    *     this can be any value less than less than the current BitLength.
    */
    BitWalker.prototype.setStride = function (newStride) {
        newStridePos = Number(newStride) || 0;
        if (newStride < 1 || newStride > BitLength)
            throw new Error("Stride must be between 1 and BitLength");
        if (LockStrideWidth && newStride > 8)
            throw new Error("You must unlock StrideWidth before setting a stride above 8.");

        Stride = newStride;
        if (LockStrideWidth)
            StrideWidth = newStride;
    }

    /**
    * Retrieve our current Stride Width. This is how many bits are read after a get function.
    * @type {number}
    */
    BitWalker.prototype.getStrideWidth = function () {
        return Stride;
    }

    /**
    * Sets our stride width. This controls how many bits are read in a get function. If StrideWith is locked
    *     this will also update Stride.
    * @param newStrideWidth The new width to use. This must be between 1 and 8;
    */
    BitWalker.prototype.setStrideWidth = function (newStrideWidth) {
        newStrideWidth = Number(newStrideWidth) || 0;
        if (newStrideWidth < 1 || newStrideWidth > 8)
            throw new Error("StrideWidth must be between 1 and 8");
        StrideWidth = newStrideWidth;
        if (LockStrideWidth)
            Stride = newStrideWidth;
    }

    /**
    * Gets our current Stride Position. This will be the position of the next walk or stand function.
    * @type {number}
    */
    BitWalker.prototype.getStridePosition = function () {
        return StridePos;
    }

    /**
    * Sets our current Stride Position. This will be the position of the next walk or stand function.
    * @param newStridePos The new Position. This must be greater than 0 and less then the BitLength.
    */
    BitWalker.prototype.setStridePosition = function (newStridePos) {
        newStridePos = Number(newStridePos) || 0;
        if (newStridePos < 0 || newStridePos > BitLength)
            throw new Error("Stride Position must be greater than 0 and less than BitLength");
        StridePos = newStridePos;
    }

    /**
    * Lock Stride and StrideWith. When Locked Stride and StrideWidth are kept the same.
    *     Sets the Stride to the current StrideWidth.
    */
    BitWalker.prototype.LockStrideWidth = function () {
        LockStrideWidth = true;
        Stride = StrideWidth;
    }

    /**
    * Unlock Stride and StrideWith. When unlocked Stride and StrideWidth can be changed independently.
    */
    BitWalker.prototype.UnLockStrideWidth = function () {
        LockStrideWidth = false;
    }

    /**
    * Returns true if Stride and StrideWidth are locked to the same value.
    * @type {boolean}
    */
    BitWalker.prototype.StrideWidthLocked = function () {
        return LockStrideWidth;
    }

    /**
    * Set the stride position to 0;
    */
    BitWalker.prototype.StrideReset = function () {
        StridePos = 0;
    }

    /**
    * Retrieve the data from the current walk location and advance.
    * @return {number} Returns the bit data before walking.
    */
    BitWalker.prototype.WalkGet = function () {
        if (StridePos > BitLength) return 0;
        var result = this.GetBits(StridePos, StrideWidth);
        StridePos += Stride;
        return result;
    }

    /**
    * Retrieve the data from the current walk location but do not advance.
    * @return {number} Returns the bit data before walking.
    */
    BitWalker.prototype.StandGet = function () {
        if (StridePos > BitLength) return 0;
        return this.GetBits(StridePos, StrideWidth);
    }

    /**
    * Advanced to the next location.
    */
    BitWalker.prototype.Walk = function () {
        if (StridePos > BitLength) return;
        StridePos += Stride;
    }

    /**
    * Put the data in the current walk location. If the end of the array is reached nothing happens.
    * @param Value Data to use.
    */
    BitWalker.prototype.WalkPut = function (Value) {
        if (StridePos > BitLength) return;
        this.SetBits(StridePos, StrideWidth, Value);
        StridePos += Stride;
    }

    /**
    * Put the data in the current walk location but do not advance. If the end of the array
    *     is reached nothing happens.
    * @param Value Data to use.
    */
    BitWalker.prototype.StandPut = function (Value) {
        if (StridePos > BitLength) return;
        this.SetBits(StridePos, StrideWidth, Value);
    }

    /**
    * This returns a string representation of the bit array. The most significant byte is
    *     printed first instead of the first one in the list.
    * @param {number} radix The Radix to format the data in. Default value is 16 (Hex)
    * @param {number} SpaceEvery Number of bytes to print before including a space. If set to -1 
    *                   no spaces will be produced. Default value is -1 (No Spaces)
    * @return {string} The string representation.
    */
    BitWalker.prototype.toString = function (radix, SpaceEvery) {
        SpaceEvery = Number(SpaceEvery) || -1;
        radix = Number(radix) || 16;

        if (radix < 2 || radix > 36)
            throw new Error("Radix must be between 2 and 36.");

        /** @type {string} */
        var result = "";
        /** @type {string} */
        var tmp = "";
        /** @type {number} */
        var bpb = this._rCPB(radix);
        /** @type {string} */
        var padString = this._gPS(bpb, "0");
        /** @type {number} */
        var currentPad = 0;

        for (var i = Length - 1; i >= 0; i--) {
            if (currentPad == SpaceEvery && currentPad != -1) {
                currentPad = 0;
                result += " ";
            }
            currentPad++;
            tmp = padString + BitArray[i].toString(radix);
            tmp = tmp.slice(-bpb);
            result += tmp
        }
        return result;
    }

    /**
    * Returns the number of characters a radix needs to display a byte.
    *     Input is not checked. Values above 36 and below 2 are undefined.
    * @return {number} Bit count
    */
    this._rCPB = function (radix) {
        /**
        * @const
        * @type {Array.<number>}
        */
        var bpr = [0, 0, 8, 6, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
        return bpr[radix];
    }

    /**
    * Generate a 0 pad string.
    *     Input is not checked.
    * @return {string}
    */
    this._gPS = function (c) {
        /** @type {string} */
        var r = "";
        for (var i = 0; i < c; i++)
            r += "0";
        return r;
    }

    /**
    * Zero out the bit array.
    */
    BitWalker.prototype.ZeroData = function () {
        for (var i = 0; i < Length; i++)
            BitArray[i] = 0;
    }

    /**
    * Sets the value of the Byte to the array starting at the provided byte Position.
    * @param Position Byte position to set.
    * @param Value Value to set.
    */
    BitWalker.prototype.SetByte = function (Position, Value) {
        Position = Number(Position);
        Value = Number(Value);

        if (Position < 0 || Position > Length)
            throw new Error("Position must be a number greater than or equal to 0 and"
                          + " less than the length of the array in bits.");

        if (Value < 0 || Value > 255)
            throw new Error("Value must be a positive number between 0 and 255");

        BitArray[Position] = Value;
    }

    /**
    * Sets the value of the Byte to the array starting at the provided bit Position.
    *     This sets the data from Value starting from the low bit and moving up, Any data
    *     needs to be shifted so it starts there if it does not.
    * @param {number} Position Bit position to start at. 
    * @param {number} Value Value to set.
    * @param {number} Width Width of data to set.
    */
    BitWalker.prototype.SetBits = function (Position, Width, Value) {
        Position = Number(Position);
        Value = Number(Value);
        Width = Number(Width) || 8;

        if (Position < 0 || Position > BitLength)
            throw new Error("Position must be a number greater than or equal to 0 and"
                          + " less than the length of the array in bits.");

        if (Value < 0 || Value > 255)
            throw new Error("Value must be a positive number between 0 and 255");

        if (Width < 1 || Width > 8)
            throw new Error("Width must be a positive number between 1 and 8");

        var WorkingByte = Math.floor(Position / 8);
        var StartBit = Position % 8;

        /*Easy*/
        if (StartBit == 0 && Width == 8) {
            BitArray[WorkingByte] = Value;
            return;
        }

        /*Harder*/
        this._sb(Value, Width, WorkingByte, StartBit);
    }

    /**
    * Retrieve a byte from the array.
    * @param {number} Position Byte position to retrieve.
    */
    BitWalker.prototype.GetByte = function (Position) {
        Position = Number(Position) || 0;

        if (Position < 0 || Position > BitLength)
            throw new Error("Position must be a number greater than or equal to 0 and"
                          + " less than the length of the array in bytes.");
        return BitArray[Position];
    }

    /**
    * 
    * @param {number} Position
    * @param {number} Width
    */
    BitWalker.prototype.GetBits = function (Position, Width) {
        Position = Number(Position) || 0;
        Width = Number(Width) || 8;

        if (Width < 1 || Width > 8)
            throw new Error("Width must be a positive number between 1 and 8");

        var WorkingByte = Math.floor(Position / 8);
        var StartBit = Position % 8;

        /*Easy test*/
        if (StartBit == 0 && Width == 8) {
            return BitArray[WorkingByte];
            return;
        }


        return this._gb(Width, WorkingByte, StartBit);
    }

    /**
    * Private function. Update the array with the data. 
    * This function does not verify or sanitize its input. 
    * @param Value Data to set.
    * @param Width Must be between 1 and 8.
    * @param WorkingByte Current Byte to use. Must be greater than 0 and less than the array length.
    * @param StartBit Current Bit to start at. Must be between 0 and 7.
    */
    this._sb = function (Value, Width, WorkingByte, StartBit) {

        /*
    This takes several steps. The following is an example of our logic
      given the following variables:
     Startbit = 5, Width = 5, value = 00101
     
     We begin knowing our value however Javascript provides it as a 32 bit integer.
    
     s        ???????? ???????? ???????? ???00101
     s << 5   ???????? ???????? ??????01 01000000
     
     It is possible that this remaining data is not all 0s so we need to first ensure
     its 0. To this and later zero out the destination slot we create a bit mask of 
     what we are changing
    
     p        11111111 11111111 11111111 11111111
     p >>> 27 00000000 00000000 00000000 00011111
     p << 5   00000000 00000000 00000011 11100000
       
     AND p and s to the data to zero out unknown data.
    
     p        00000000 00000000 00000011 11100000
     s        ???????? ???????? ??????01 01000000
     s & p    00000000 00000000 00000001 01000000
    
     Get our external data.
     q        ???????? ???????? ???????? ????????
    
    
     Now we need to erase the destination slot. If we don't the following occurs:
     Assume value of q was 0xFF
    
     q      11111111 
     s      00010100
     q | s  11111111
    
     We want the value 10010111. To solve this we zero out the target area.
     Because a bitwise NAND doesn't exists we NOT our flag then AND it against q.
    
    p NOT p  00000000 00000000 00000011 11100000
    p        11111111 11111111 11111100 00011111
    q AND P  ???????? ???????? ??????00 000?????
            
     While we still don't know most of the values here, we know our target slot is 0.
     We can now OR s and q to get our result.
    
     s       00000000 00000000 00000001 01000000
     q       ???????? ???????? ??????00 000?????
     q | s   ???????? ???????? ??????01 010?????
    
     Now we can save s back to the array. This will just save the 010????? data.
     Next we run a check to see if any data was left over.
    
     s >> 8  ???????? ???????? ???????? ??????01
     p >> 8  00000000 00000000 00000000 00000011
    
     Test if zero:
     s & p   00000000 00000000 00000000 00000001
    
     Since s isn't 0 we call the function again:
     Value = s
     Width = (StartBit + Width) - 8 = (5 + 5) - 8 = 2
     WorkingByte++
     StartBit = 0;
    
     This will push the remaining data onto the next byte.
    
    */

        var s = Value << StartBit;
        var p = 0xFFFFFFFF >>> (32 - Width);
        p = p << StartBit;
        s = s & p;
        var q = BitArray[WorkingByte];
        p = ~p;
        q = q & p;
        q = q | s;
        BitArray[WorkingByte] = q;

        s = s >>> 8;
        p = (~p) >>> 8;
        if (p & s) {
            if (WorkingByte + 1 > length)
                return;
            /* If we hit the end of the array we can just discard the data...?
               Should probably throw an error...*/
            this._sb(s, (StartBit + Width) - 8, ++WorkingByte, 0);
        }
    }
  
    /**
    * GetBits. Input is not validated and may produce unexpected behavior.
    * @param Width Must be 
    * @param WorkingByte
    * @param StartBit
    */
    this._gb = function (Width, WorkingByte, StartBit) {

        /*
     This takes several steps. The following is an example for the following information:
     Startbit = 5, Width = 7
     
     We begin by pulling the current WorkingByte. the x has our result we require and Y is 
     information that will be in the nexr bit.
    
     s        ???????? ???????? ????YYYY xxx?????
     s >>  5  ???????? ???????? ???????? ?YYYYxxx
     
     We want to zero out the remaining Y and unknown bits as these are not valid. This will allow
     us to later OR the correct data into place. This is done via a bit mask.
    

     p        11111111 11111111 11111111 11111111
     p >>> 32 - (Width)
     p >>> 25 00000000 00000000 00000000 01111111

     We need to shift it a little more if some of the mask would extend into the next bit

     if((Startbit + Width) - 8 > 0)

     p >>> (Startbit + Width) - 8
     p >>> 4  00000000 00000000 00000000 00000111
       
     AND p and s to the data to zero out unwanted data.
    
     p        00000000 00000000 00000000 00000111
     s        ???????? ???????? ???????? ?YYYYxxx
     s & p    00000000 00000000 00000000 00000xxx

     Now we need to test if theres data in the next bit. If so we need to retrieve it.
     Otherwise we can return s. We also test if we are the last element in the array.


     For this example we need to, so we call _gb with the following data:

     NewWidth = (Startbit + Width) - 8)
     NewWidth = 5 + 7 - 8 = 12 - 8 = 4 (This equals our YYYY values above)


     q = _gb(NewWidth, WorkingByte++,0)
     q        00000000 00000000 00000000 0000YYYY

     We know _gb returned 0d data outside our request. We can perform a quick test now,
     If q is 0 we can just return as we know s is already zerod out there.

     if(0x00 | q == 0x00) return s;

     If not we need to do a little more math.

     q << 8 - StartBit
     q << 3   00000000 00000000 00000000 0YYYY000

     Last we can finally OR them together

     q        00000000 00000000 00000000 0YYYY000
     s | q    00000000 00000000 00000000 0YYYYxxx

     We can return now.
    
    */
        
        var s = BitArray[WorkingByte] >> StartBit;
        var p = 0xFFFFFFFF >>> (32 - Width);

        if ((StartBit + Width) - 8 > 0)
            p = p >>> ((StartBit + Width) - 8)

        s = s & p;
        if (StartBit + Width <= 8) return s;
        if(WorkingByte + 1 > length) return s;
        var q = this._gb((StartBit + Width) - 8, ++WorkingByte, 0);
        if (0x00 | q == 0x00) return s;
        q = q << (8 - StartBit);
        s = s | q;
        return s;
    }
}
