# 04_1st-law

## 1. The First Law of Thermodynamics

- **Quasi-static process:** A process that occurs slowly enough that the system remains in thermal equilibrium at all times.

- **Work ($W$):**

	- Defined as the integral of pressure over volume: $dW = F ds = P A ds = P dV \implies W = \int P dV$

    - Geometrically, work is the area under the curve on a $P$-$V$ diagram.

	![[General-physics-1st-law1.png]]

    - **Sign Convention:**

        - Work done _by_ the gas: $dW = P dV$

        - Work done _to_ the gas: $dW = -P dV$

    - **Path Dependence:** The amount of work done depends on the path taken from the initial state ($i$) to the final state ($f$). For example, expanding at a constant high pressure yields more work than dropping the pressure first and then expanding ($W^{(a)} < W^{(c)} < W^{(b)}$).

	![[General-physics-1st-law2.png]]

- **The First Law of Thermodynamics:**

	- **Formula:** $\Delta U = \Delta Q - W$

    _(Where $\Delta Q$ is heat absorbed, and $W$ is work done by the system)._

    - **Differential form:** $dU = \delta Q - \delta W$

        _(Note: The symbol $\delta$ indicates an inexact, path-dependent differential)._

## 2. Differentials and Thermodynamic Processes

### Inexact / Imperfect Differentials

- The integral of an inexact differential is path-dependent.

- **Example:** $\delta g = dx + \frac{x}{y} dy$ (inexact)

    - Evaluating from $A(1,1)$ to $B(2,2)$ via Path 1 ($A \rightarrow C(2,1) \rightarrow B$) yields: $1 + 2\ln2$.

    - Evaluating via Path 2 ($A \rightarrow D(1,2) \rightarrow B$) yields: $\ln2 + 1$.

- **Contrast (Exact):** $df = \frac{dx}{x} + \frac{dy}{y}$ is exact. Both paths yield $2\ln2$.

### Different Processes (Not necessarily quasi-static)

- **Isobaric:** Pressure ($P$) is fixed.

- **Isochoric (Isovolumetric):** Volume ($V$) is fixed.

- **Isothermal:** Temperature ($T$) is fixed.

- **Adiabatic:** $Q = 0$ (No heat transfer).

![[General-physics-1st-law3.png]]

## 3. Work in Specific Quasi-Static Processes

### Quasi-Static Isothermal Expansion

Work done by the gas:

$$
W = \int_{V_i}^{V_f} P dV = \int_{V_i}^{V_f} \frac{nRT}{V} dV = nRT \ln \frac{V_f}{V_i}
$$

### Quasi-Static Adiabatic Process

Governing equation: **$P V^\gamma = \text{constant}$** (where $\gamma \equiv \frac{C_P}{C_V}$)

- **Proof:**

    1. First law for adiabatic: $dU = 0 - P dV = -P dV$

    2. Using $U = n C_V T \implies n C_V dT = -P dV$

    3. Ideal gas law differential: $P dV + V dP = nR dT$

    4. Substitute (2) into (3): $-\frac{P}{C_V} dV = \frac{P}{R} dV + \frac{V}{R} dP$

    5. Rearrange: $P\left(\frac{1}{R} + \frac{1}{C_V}\right) dV + \frac{V}{R} dP = 0$

    6. Multiply by $R$ and use $C_P = C_V + R$: $\frac{C_P}{C_V} \frac{dV}{V} + \frac{dP}{P} = 0$

    7. Integrate ($\gamma = \frac{C_P}{C_V}$): $\gamma \ln V + \ln P = \text{constant} \implies P V^\gamma = \text{constant}$.

### Adiabatic Free Expansion

- $\Delta Q = 0$ (Adiabatic) and $W = 0$ (Free expansion into a vacuum).

- It is _not_ quasi-static (the system is out of equilibrium except for the initial and final states).

- Since $\Delta U = 0 \implies U_i = U_f$, the temperature remains constant ($T_i = T_f$).

## 4. Heat Engines and Thermal Efficiency

- **Definition:** A cyclic device that extracts energy (heat) from the environment and does work (e.g., steam engine, gasoline engine).

- **Cyclic Process:**

	![[General-physics-1st-law4.png]]

	- The net change in internal energy over one cycle is zero ($\Delta U = 0$).

    - Work done per cycle: $W = \oint P dV$

    - Net heat absorbed: $\Delta Q = W = \oint P dV$

- **Thermal Efficiency ($\varepsilon$):**

    $$
\varepsilon \equiv \frac{W}{Q_H}
    $$

    Since $W = Q_H - Q_L$ ($Q_H$: heat from high-T reservoir, $Q_L$: heat to low-T reservoir):

    $$
\varepsilon = 1 - \frac{Q_L}{Q_H}
    $$

## 5. Engine Cycles

### A. Otto Cycle (1876, Nicolaus Otto)

Commonly used in petrol engines.

![[General-physics-1st-law5.png]]

- **Four Strokes:**

    - $O \rightarrow A$: Intake (often omitted in schematic drawings)

    - $A \rightarrow B$: Adiabatic Compression

    - $B \rightarrow C \rightarrow D$: Combustion/Ignition/Power ($B \rightarrow C$ is isochoric heat absorption $Q_H$; $C \rightarrow D$ is adiabatic expansion)

    - $D \rightarrow A (\rightarrow O)$: Exhaust ($D \rightarrow A$ is isochoric heat rejection $Q_L$)

- **Efficiency Derivation:**

    - $Q_L = n C_V (T_D - T_A)$ and $Q_H = n C_V (T_C - T_B)$

    - $\varepsilon_{\text{Otto}} = 1 - \frac{T_D - T_A}{T_C - T_B}$

    - Applying $T V^{\gamma-1} = \text{constant}$ to the adiabatic steps ($A \rightarrow B$ and $C \rightarrow D$):

        $$
\left(\frac{V_2}{V_1}\right)^{\gamma-1} = \frac{T_A}{T_B} = \frac{T_D}{T_C}
        $$

    - **Final Otto Efficiency:** $\varepsilon_{\text{Otto}} = 1 - \left(\frac{V_2}{V_1}\right)^{\gamma-1}$

### B. Diesel Cycle

Commonly used in diesel engines.

![[General-physics-1st-law6.png]]

- **Key Difference:** Heat absorption ($Q_H$) occurs via an _isobaric_ process ($B \rightarrow C$), while heat rejection ($Q_L$) remains _isochoric_ ($D \rightarrow A$).

- **Efficiency Derivation:**

    - $T_B = \left(\frac{V_1}{V_2}\right)^{\gamma-1} T_A$ (from adiabatic $A \rightarrow B$)

    - $T_C = \frac{V_3}{V_2} T_B = \frac{V_3}{V_2} \left(\frac{V_1}{V_2}\right)^{\gamma-1} T_A$ (from isobaric $B \rightarrow C$)

    - $T_D = \left(\frac{V_3}{V_1}\right)^{\gamma-1} T_C = \left(\frac{V_3}{V_2}\right)^\gamma T_A$ (from adiabatic $C \rightarrow D$)

    - $Q_H = n C_P (T_C - T_B)$ and $Q_L = n C_V (T_D - T_A)$

    - **Final Diesel Efficiency:**

        $$
\varepsilon_{\text{diesel}} = 1 - \frac{C_V (T_D - T_A)}{C_P (T_C - T_B)} = 1 - \frac{1}{\gamma} \frac{(V_3/V_2)^\gamma - 1}{(V_3/V_2) - 1} \left(\frac{V_2}{V_1}\right)^{\gamma-1}
        $$

### C. Dual Cycle

Commonly used in ship engines.

![[General-physics-1st-law7.png]]

- **Cycle structure:** Heat addition is split into two sequential steps—an _isochoric_ process followed by an _isobaric_ process—bridged by adiabatic expansion and compression, concluding with an isochoric heat rejection.
