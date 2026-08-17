## **1. Elasticity**

Solids are NOT perfectly rigid. They undergo deformation when subjected to external forces.

### **Core Definitions**

- **Stress:** The deforming force applied per unit area.
    
- **Strain:** The unit deformation (ratio of change in dimension to original dimension).
    
- **Modulus of Elasticity:** For small stresses, the relationship is linear:
    
    $$\text{Stress} = \text{Modulus} \times \text{Strain}$$
    

### **Types of Stress and Strain**

![[GP-Sound-Wave1.png]]

- schematic diagram from the hand-written notes of Mr. ztWang

1. **Tension & Compression (Tensile Stress)**
    
    - **Stress:** $F / A$
        
    - **Strain:** $\Delta L / L$
        
    - **Young's Modulus ($E$):** $\frac{F}{A} = E \frac{\Delta L}{L}$
        
2. **Shearing (Shearing Stress)**
    
    - **Stress:** $F / A$
        
    - **Strain:** $\Delta x / L$
        
    - **Shear Modulus ($G$):** $\frac{F}{A} = G \frac{\Delta x}{L}$
        
3. **Hydraulic Stress**
    
    - **Hydraulic Stress:** Pressure $P$
        
    - **Strain:** $\Delta V / V$
        
    - **Bulk Modulus ($B$):** $P = B \frac{\Delta V}{V}$
        

### **Stress-Strain Curve**

The relationship between stress and strain ($\Delta L/L$) generally follows these stages:
   
![[GP-Sound-Wave2.png]]

- **Linear Region:** Proportional elastic deformation.
    
- **Yield Strength:** The point beyond which the material becomes **permanently deformed**.
    
- **Ultimate Strength:** The maximum stress the material can withstand.
    
- **Rupture:** The point where the material breaks.
    

---

## **2. Sound Waves**

**Definition:** Any mechanical longitudinal waves.

- They propagate via **wavefronts** expanding outward from a source along **rays**.
    

![[GP-Sound-Wave3.png]]

### **Speed of Sound**

- In solids (phonon model): $v = a\sqrt{\frac{K}{m}}$ (derived from $\frac{\partial^2 u}{\partial t^2} = v^2 \frac{\partial^2 u}{\partial x^2}$).
    
- In fluids (e.g., air, via compression/expansion):
    
    $$v = \sqrt{\frac{B}{\rho}}$$
    

**Comparison: Speed of Sound in Air vs. Water**

- Density: $\rho_{\text{water}} \approx 10^3 \text{ kg/m}^3$, $\rho_{\text{air}} \approx 1.3 \text{ kg/m}^3$. Naively, lower density might suggest $v_{\text{air}} \gg v_{\text{water}}$. However, this is incorrect.
    
- Bulk Modulus: $B_{\text{water}} \approx 2.1 \times 10^9 \text{ Pa}$ (highly incompressible), whereas $B_{\text{air}} \approx 1.4 \times 10^5 \text{ Pa}$.
    
- **Conclusion:** Because water is vastly more incompressible than air, $v_{\text{water}} \gg v_{\text{air}}$ ($\sim 1450 \text{ m/s}$ in water vs. $\sim 330 \text{ m/s}$ in air).
    

### **Derivation of $v = \sqrt{B/\rho}$**

Consider a volume of air $V = \Delta x \cdot A = (v \Delta t) A$ being compressed:

1. Apply Newton's Second Law ($F=ma$):
    
    $$-\Delta p A = (\rho \Delta x A) \frac{\Delta v}{\Delta t}$$
    
    Since $\frac{\Delta x}{\Delta t} = v$, this simplifies to:
    
    $$-\Delta p = \rho v \Delta v$$
    
2. Relate to Volume Change:
    
    $$\frac{\Delta V}{V} = \frac{A \Delta v \Delta t}{A v \Delta t} = \frac{\Delta v}{v}$$
    
3. Substitute and Solve for $v$:
    
    $$-\Delta p = \rho v^2 \left(\frac{\Delta V}{V}\right) \implies \rho v^2 = -\frac{\Delta p}{\Delta V / V} = B$$
    
    $$v = \sqrt{\frac{B}{\rho}}$$
    

---

## **3. Sound Intensity and Sound Level**

### **Intensity ($I$)**

Intensity is the energy transfer rate ($P$) per unit area ($A$):

$$I = \frac{P}{A}$$

For a sinusoidal sound wave with longitudinal displacement $s(x,t) = s_m \cos(kx - \omega t)$:

$$I = \frac{1}{2} \rho v \omega^2 s_m^2$$

**Proof:**

For a slice of air with thickness $dx$ and area $A$:

1. Kinetic energy: $dK = \frac{1}{2} (\rho \, dx \, A) v_s^2$
    
2. Particle velocity: $v_s = \frac{\partial s(x,t)}{\partial t} = \omega s_m \sin(kx - \omega t)$
    
3. Substitute $v_s$: $dK = \frac{1}{2} \rho \, A \, dx \cdot \omega^2 s_m^2 \sin^2(kx - \omega t)$
    
4. Rate of change: $\frac{dK}{dt} = \frac{1}{2} \rho A v \omega^2 s_m^2 \sin^2(kx - \omega t)$ (since $dx/dt = v$)
    
5. Time average over a cycle: $\left(\frac{dK}{dt}\right)_{\text{avg}} = \frac{1}{4} \rho A v \omega^2 s_m^2$
    
6. Assuming energy equipartition without proof: $\left(\frac{dU}{dt}\right)_{\text{avg}} = \left(\frac{dK}{dt}\right)_{\text{avg}}$
    
    $$I = \frac{d(K+U)/dt}{A} = 2 \times \frac{\frac{1}{4} \rho A v \omega^2 s_m^2}{A} = \frac{1}{2} \rho v \omega^2 s_m^2$$
    

**Point Source:**

For a source emitting isotropically (assuming energy conservation):

$$I = \frac{P_s}{4\pi r^2}$$

### **Sound Level ($\beta$)**

Measured in decibels (dB):

$$\beta = 10 \log_{10}\left(\frac{I}{I_0}\right)$$

- $I_0 \equiv 10^{-12} \text{ W/m}^2$ (hearing threshold; at $I=I_0$, $\beta = 0$).
    
- **Note:** $\beta_2 - \beta_1 = 10 \iff I_2 / I_1 = 10$.
    

**Typical Sound Levels:**

- Bedroom at night: $\sim 30 \text{ dB}$
    
- Conversation: $\sim 60 \text{ dB}$
    
- Rock concert: $\sim 110 \text{ dB}$
    
- Pain threshold: $\sim 120 \text{ dB}$
    

**Frequency Spectrum:**

Sound level is independent of sound frequency.

- Infrasound: $< 20 \text{ Hz}$
    
- Audible frequencies: $20 \text{ Hz} \sim 20 \text{ kHz}$
    
- Ultrasound: $> 20 \text{ kHz}$
    

---

## **4. The Doppler Effect**

The apparent change in frequency due to the relative motion of the source and the detector.

$$f' = f \frac{v \pm v_D}{v \pm v_S}$$

- $v$: speed of sound in the medium.
    
- $v_D$: speed of the detector (relative to medium).
    
- $v_S$: speed of the source (relative to medium).
    

**Sign Convention Rule:**

- If D & S move **towards** each other: $f' > f$ (use $+$ in numerator, $-$ in denominator).
    
- If D & S move **away** from each other: $f' < f$ (use $-$ in numerator, $+$ in denominator).
    

### **Example Application**

**Problem:** A train passes a station. An observer at the station hears the siren fluctuating such that $1000 \text{ Hz} \le f \le 1200 \text{ Hz}$. Given $v = 330 \text{ m/s}$, what is the speed of the train?

**Solution:**

$$f \frac{v}{v - v_S} = 1200 \text{ Hz} \quad \text{(Approaching)}$$

$$f \frac{v}{v + v_S} = 1000 \text{ Hz} \quad \text{(Receding)}$$

Divide the two equations:

$$\frac{v + v_S}{v - v_S} = \frac{1200}{1000} = \frac{12}{10}$$

$$10v + 10v_S = 12v - 12v_S \implies 22v_S = 2v$$

$$v_S = \frac{v}{11} = \frac{330}{11} = 30 \text{ m/s}$$

_(Note: Cosmological redshift ($\lambda \uparrow, f \downarrow$) relies on a similar principle, indicating galaxies are moving away from us, supporting the "Big Bang" theory)._

---

## **5. Supersonic Speeds & Shock Waves**

When the source speed equals or exceeds the speed of sound ($v_S \ge v$):

- **$v_S = v$:** Wavefronts bunch up completely at the leading edge ($\lambda - v_S T = 0$).
    
- **$v_S > v$ (Shock Waves):** The source outpaces the wavefronts. The envelope function of the wavefronts forms a **Mach Cone**.
    

![[GP-Sound-Wave4.png]]

**Mach Cone Geometry:**

- Mach cone angle ($\theta$):
    
    $$\theta = \arcsin\left(\frac{v t}{v_S t}\right) = \arcsin\left(\frac{v}{v_S}\right)$$
    
- **Mach Number:** $\frac{v_S}{v}$
    

_Examples of objects generating shock waves: jets, bullets, boats (wake)._