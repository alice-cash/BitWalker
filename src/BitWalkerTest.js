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
 * Test functions of our BitWalker function. This is currently very crude and does not test
 * all possible functions.
 */
function BitWalkerTest() {


    var bw = new BitWalker(10);

    //Note regarding this test:
    // Typically we see arrays like this:
    // [Element 1, Element 2, Element 3] 

    // Which is how it is stored in the bitWalker. The key here is that Element1 is the least
    // Significant byte. When you load data such as the byte array below, you load the last
    // Item first so its put in the array correctly.
    // [01001011, 01101101, 10000001]

    // If we just print these out in order, e.g:
    // [76543210, FEDCBA98, ...]
    // We can see this puts our very first bit in the middle and the 8th lease significant bit
    // at the beginning of our string. To fix this toString() prints the elements backwards so 
    // we get:
    // [..., FEDCBA98, 76543210]

    //Random binary data.
    //                79    72 71    64 63    56 55    48 47    40 39    32 31    24 23    16 15     8 7      0
    var TestString = "01110001 01111001 10001101 11001001 00110101 10001111 10100011 10000001 01101101 01001011";
    var TestDataString = ["01110001", "01111001", "10001101", "11001001", "00110101",
                          "10001111", "10100011", "10000001", "01101101", "01001011"];
    var TestData = [];



    // We reverse it so the last bytes get inserted first.

    TestDataString = TestDataString.reverse();

    for (var i = 0; i < 10; i++)
        TestData[i] = parseInt(TestDataString[i], 2);

    for (var i = 0; i < 10; i++)
        bw.SetByte(i, TestData[i]);

    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");

    //            79    72 71    64 63    56 55    48 47    40 39    32 31    24 23    16 15     8 7      0
    TestString = "01110001 01111001 10001101 11001001 00110101 10001111 10100011 11111111 01101101 01001011";
    //Replace Starting at 16 with width of 8 with 11111111

    bw.SetBits(16, parseInt("11111111", 2), 8);

    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");


    //            79    72 71    64 63    56 55    48 47    40 39    32 31    24 23    16 15     8 7      0
    TestString = "01110001 01111001 10001101 11001001 00110101 10001111 10100011 10000001 01101101 01001011";
    //Revert previous with 10000001

    bw.SetBits(16, parseInt("10000001", 2), 8);

    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");

    //                                                     42      35   
    //            79    72 71    64 63    56 55    48 47   |40 39  | 32 31    24 23    16 15     8 7      0
    TestString = "01110001 01111001 10001101 11001001 00110101 01010111 10100011 10000001 01101101 01001011";
    //Replace Starting at 35 with width of 8 with 10101010

    bw.SetBits(35, parseInt("10101010", 2), 8);

    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");

    //                                                     42      35   
    //            79    72 71    64 63    56 55    48 47   |40 39  | 32 31    24 23    16 15     8 7      0
    TestString = "01110001 01111001 10001101 11001001 00110101 10001111 10100011 10000001 01101101 01001011";
    //Revert previous with 01011000

    bw.SetBits(35, parseInt("10110001", 2), 8);

    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");


    //            79    72 71    64 63    56 55    48 47    40 39    32 31    24 23    16 15     8 7      0
    TestString = "01110000 01111000 10001100 11001000 00110100 10001100 10100000 10000000 01101100 01001000";
    //Walk 8 and replace first 2 bits with 00

    bw.StrideReset();
    bw.UnLockStrideWidth();
    bw.setStride(8);
    bw.setStrideWidth(2);

    //We stick false data to ensure its only reading the first 2 bytes.
    for (var i = 0; i < 10; i++)
        bw.WalkPut(parseInt("11111100", 2))

    bw.StrideReset();

    //Walk and read these in.
    for (var i = 0; i < 10; i++)
        if (bw.WalkGet() != parseInt("00", 2))
            alert("Walk fail!");


    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");


    //            79    72 71    64 63    56 55    48 47    40 39    32 31    24 23    16 15     8 7      0
    TestString = "00100010 00101010 10101010 10101010 00100010 10101010 10100010 10100010 00101010 00101010";
    //Walk 4 and replace first 3 bits with 010

    bw.StrideReset();
    bw.UnLockStrideWidth();
    bw.setStride(4);
    bw.setStrideWidth(3);

    //We stick false data to ensure its only reading the first 2 bytes.
    for (var i = 0; i < 20; i++)
        bw.WalkPut(parseInt("11111010", 2))

    bw.StrideReset();

    //Walk and read these in.
    for (var i = 0; i < 20; i++)
        if (bw.WalkGet() != parseInt("010", 2))
            alert("Walk fail!");


    if (bw.toString(2, 1) != TestString)
        alert("Strings not the same!");


    alert("Tests good!");

}
