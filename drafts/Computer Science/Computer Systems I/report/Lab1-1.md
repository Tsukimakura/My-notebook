# Lab1-1 report

**陈灵石 图灵2501 3250104863**

![[sys-lab1-1-4to1MUX.png]]

以上为在 logisim 中绘制的四路选择器原理图。S 为 2 比特的输入总线，0 为低位， 1 为高位，分别与一个 1-to-2 Decoder 相连，然后共同组成一个 2-to-4 Decoder，再与 $4 \times 2$ AND-OR GATE 相连组成四路选择器。由 S 的两位输入控制输出 I0 ~ I3 的某个输入。

控制 S 和 I 的输入，与实验文档中的真值表一致，表示电路连接正确。

**Mux8T1_1.v**

```verilog
module Mux8T1_1(
   input [7:0] I,
   input [2:0] S,
   output O
);

   //your verilog code
   wire I0123;
   wire I4567;

   MUX4T1_1 mux0(I[0], I[1], I[2], I[3], I0123, S[1:0]);
   MUX4T1_1 mux1(I[4], I[5], I[6], I[7], I4567, S[1:0]);
   assign O = S[2] ? I4567 : I0123;

endmodule
```

I0123 和 I4567 临时储存两个四路选择器的结果，再利用三目运算符形成一个二路选择器，组成八路选择器。

**testbench.v**

```verilog
module Testbench;
    reg [7:0] I;
    reg [2:0] S;
    wire O;
    integer i;

    initial begin
        //your test sample
        I = 8'b10101010;
	    for(i = 0; i < 8; i++) begin
	        S = i[2:0];
	        #10;
        end
	    $finish;
    end

    Mux8T1_1 dut(
        .I(I),
        .S(S),
        .O(O)
    );

    `ifdef VERILATE
        initial begin
            $dumpfile({`TOP_DIR,"/Testbench.vcd"});
            $dumpvars(0,dut);
            $dumpon;
        end
    `endif

endmodule
```

仿真代码中硬编码输入为 8'b10101010，利用循环每十秒切换一次选择的路，从 I0 到 I7。预计仿真结果的波形为规则的周期震荡。

![[sys-lab1-1-verilator仿真.png]]

仿真波形与预测一致。

**top.v**

```verilog
module top(
  input [7+3:0] SW,
  output LD0
);

  // add connection from FPGA IO to the main
  Mux8T1_1 main(
    .I(SW[7:0]),
    .S(SW[10:8]),
    .O(LD0)
  );

endmodule
```

实例化八路选择器，并与开发板上的引脚建立对应关系。

**nexysa7.xdc**

```verilog
## IO
set_property PACKAGE_PIN {J15} [get_ports {SW[0]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[0]}]
set_property PACKAGE_PIN {L16} [get_ports {SW[1]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[1]}]
set_property PACKAGE_PIN {M13} [get_ports {SW[2]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[2]}]
# add IO
set_property PACKAGE_PIN {R15} [get_ports {SW[3]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[3]}]
set_property PACKAGE_PIN {R17} [get_ports {SW[4]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[4]}]
set_property PACKAGE_PIN {T18} [get_ports {SW[5]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[5]}]
set_property PACKAGE_PIN {U18} [get_ports {SW[6]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[6]}]
set_property PACKAGE_PIN {R13} [get_ports {SW[7]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[7]}]
set_property PACKAGE_PIN {T8} [get_ports {SW[8]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[8]}]
set_property PACKAGE_PIN {U8} [get_ports {SW[9]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[9]}]
set_property PACKAGE_PIN {R16} [get_ports {SW[10]}]
set_property IOSTANDARD {LVCMOS33} [get_ports {SW[10]}]

set_property PACKAGE_PIN {H17} [get_ports {LD0}]
set_property IOSTANDARD {LVCMOS33} [get_ports {LD0}]
```

正常类推编写引脚约束文件。约束引脚并定义电气特性。

**思考：**

1. Mux2T1_1 是两个 AND，一个 OR 和一个 NOT 组成的简单结构，它是由哪种 decoder 和 AND-OR 结构组成的

    	- decoder: 1-to-2 decoder
    	- AND-OR: $2 \times 2$ AND-OR

2. Mux4T1_1 是如何组成的

    	- Mux2T1_1 级联，把两个二路选择器的结果作为二路选择器的两个输入，如实验文档描述。

    	- 一个 2-to-4 decoder + $4 \times 2$ AND-OR

3. Mux8T1_1 是如何组成的

    	- Mux4T1_1 级联，把两个四路选择器的结果作为二路选择器的两个输入。

    	- 一个 3-to-8 decoder + $8 \times 2$ AND-OR

4. 那么 Mux$2^m$T1_n 是如何构成的呢

	- 由 $n$ 个 $Mux2^m T1\_1$ 并联组合而成

	 - $n$ 个 $m$-to-$2^m$ 译码器 + $n$ 个 $2^m \times 2$ AND-OR。其中这 $n$ 个 $Mux2^m T1\_1$ 共享同一个 $m$ 位选择信号。
