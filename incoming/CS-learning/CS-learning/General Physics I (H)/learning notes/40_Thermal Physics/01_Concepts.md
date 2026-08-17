## 1. Thermodynamic Systems & Energy

- **Energy Conversion:** Recall from mechanics that kinetic friction (e.g., a moving box slowing to a stop) converts mechanical energy ($E_{mec}$) into thermal energy ($E_{thermo}$). The total energy is conserved:
    
    $$E = E_{mec} + E_{thermo} + \dots$$
    
- **Thermodynamic System:** A macroscopic body separated from its surroundings by a boundary (e.g., a moving box, boiling water, a can of gas).
    
    - **Open System:** Exchanges both energy and matter with its surroundings.
        
    - **Closed System:** Exchanges energy but not matter.
        
    - **Isolated System:** Exchanges neither energy nor matter.
        

## 2. Temperature & Thermal Equilibrium

- **Operational Definition of Temperature:** A number read on a thermometer. The measurement process involves: Contact (energy transfer) $\rightarrow$ Wait (relaxation/equilibrium) $\rightarrow$ Read (convert to a number $T$).
    
- **Thermal Equilibrium:** A state where the macroscopic properties of a system (like temperature and volume) do not change with time.
    
    - _Note: Thermal equilibrium is dynamic; microscopic properties (like the positions of $H_2O$ molecules in still water) are still continuously changing._
        
- **The Zeroth Law of Thermodynamics** (Ralph H. Fowler, 1931): If two systems are both in thermal equilibrium with a third system, then they are in thermal equilibrium with each other.
    
    - **Logic:** $A \Leftrightarrow C$ and $B \Leftrightarrow C \Rightarrow A \Leftrightarrow B$.
        
    - **Physical Significance:** Temperature acts as a measure of the tendency of a system to spontaneously change state (out of equilibrium) when put in contact with another system. Systems in equilibrium have the same temperature. Logically, this law precedes the other laws of thermodynamics.
        

## 3. Thermometers & Temperature Scales

- **Thermometer Mechanisms:**
    
    - **Mercury thermometer:** Liquid volume changes with temperature.
        
    - **Solid thermometer:** Length changes.
        
    - **Electric resistance thermometer:** Conductor resistance changes (requires an $R-T$ relation curve to calibrate).
        
    - **Gas thermometer:** Gas pressure or volume changes at constant volume/pressure (requires a $P-T$ relation to calibrate, where $P = P_0 + \rho gh$).
        
- **Calibration:** Usually involves picking a common, easily reproducible phenomenon, such as the **triple point of water**.
    
    - $T_3 \equiv 273.16\text{ K} \equiv 0.01^\circ\text{C}$
        
- **Absolute Zero:** Extrapolating the $P-T$ graphs of different gases at a constant volume to $P=0$ reveals they all converge at **-273.15°C**.
    
- **Temperature Conversions:**
    
    - Celsius $\leftrightarrow$ Kelvin: $T^{(C)} = T^{(K)} - 273.15$
        
    - Fahrenheit $\leftrightarrow$ Celsius: $T^{(F)} = \frac{9}{5}T^{(C)} + 32$
        
- **Absolute Temperature (Kelvin) Scale:**
    
    - _Old Definition:_ $1\text{ K} \equiv \frac{1}{273.16} T_3$
        
    - _New Definition:_ Defined by the Boltzmann constant $k_B = 1.380649 \times 10^{-23}\text{ J/K}$. (A 1K change in temperature corresponds to a thermal energy change of $1.380649 \times 10^{-23}\text{ J}$).
        

## 4. The Third Law of Thermodynamics

- **Definition** (Walther Nernst, 1912): "It is impossible for any procedure to lead to the isotherm $T=0$ in a finite number of steps."
    

## 5. Thermal Expansion

- **Linear Expansion:** $\Delta L = \alpha L_0 \Delta T$
    
- **Volume Expansion:** $\Delta V = \beta V_0 \Delta T$
    
- **Expansion Coefficients ($\alpha, \beta$):** Depend on the distance between molecules, the size of molecules, and the range of intermolecular interactions.
    
- **Relationship between $\alpha$ and $\beta$:**
    
    $$V = L^3 = (L_0 + \Delta L)^3 \approx L_0^3 [1 + 3\alpha \Delta T] \Rightarrow \beta = 3\alpha$$
    
- **Examples & Applications:**
    
    - **Thermostat with a bimetallic strip:** Two metals with different $\alpha$ values (e.g., Brass $\alpha = 19 \times 10^{-6} (^\circ\text{C})^{-1}$ and Steel $\alpha = 11 \times 10^{-6} (^\circ\text{C})^{-1}$) are bonded. As temperature rises, brass expands more, causing the strip to bend and mechanically switch the circuit OFF.
        
    - **Railroad tracks:**
        
        - _Traditional:_ Physical gaps are left to accommodate $\Delta L = \alpha L_0 \Delta T$.
            
        - _High-speed rail (continuous welded):_ Must withstand immense tensile stress. Force is calculated using Young's modulus ($E$): $\frac{F}{A} = E \frac{\Delta L}{L}$. A **40°C** rise can generate expansion forces equal to roughly $10^4\text{ kg}$.
            
    - **Exception (Water):** Between **0°C** and **4°C**, water has a $\beta < 0$ (meaning it contracts when heated). Because water is densest at **4°C**, lakes freeze from the top down, with the "heavy" **4°C** water remaining at the bottom to sustain aquatic life.
        

## 6. Gases

- **Ideal Gas:**
    
    - **Equation of State:** $PV = nRT$
        
    - Variables: $n = \frac{N}{N_A}$ ($N_A$ is Avogadro's number), $R = 8.31\text{ J}\cdot\text{mol}^{-1}\cdot\text{K}^{-1}$ (Gas constant).
        
    - **Alternative Form:** $PV = N k_B T$ (derived using $R = N_A k_B$).
        
    - **Volume Expansion Coefficient ($\beta$) for an Ideal Gas:**
        
        $$\beta = \frac{1}{V_0}\frac{\Delta V}{\Delta T} \rightarrow \left(\frac{1}{V}\frac{dV}{dT}\right)_P = \left(\frac{d \ln V}{dT}\right)_P = \frac{d[\ln T + \ln(nR/P)]}{dT} = \frac{1}{T}$$
        
        At **0°C**, $\beta = \frac{1}{273.15} \approx 0.00366 (^\circ\text{C})^{-1}$.
        
- **Real Gas:**
    
    - **Van der Waals Equation of State:**
        
        $$(P + \frac{aN^2}{V^2})(V - Nb) = N k_B T$$
        
        - **$b$ parameter:** Corrects for the physical volume occupied by the molecules themselves (only highly relevant at high pressures).
            
        - **$a$ parameter:** Corrects for the intermolecular forces (interactions between molecules).
            
    - **$P-V$ Isotherms:** At lower temperatures, real gases exhibit non-ideal "dips" in their $P-V$ curves corresponding to phase transitions (gas to liquid), whereas at high temperatures they approach the smooth hyperbolic curves of ideal gases.

![[General-physics-concepts1.png]]