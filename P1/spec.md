# Especificació del projecte — P1: El padró de Barcelona

## 1. Objectiu del projecte

Aquest projecte té com a objectiu realitzar una **anàlisi exploratòria de dades demogràfiques** del Padró Municipal d'Habitants de Barcelona (1997–2026) i construir **des de zero un model de regressió lineal amb gradient descendent** per projectar tendències futures de població segons el lloc de naixement.

El projecte es divideix en dos exercicis pràctics en format Jupyter Notebook:
1. **`exercici1.ipynb` — Anàlisi exploratòria del padró (1997–2026):** Càrrega, neteja, transformació, agregació i visualització de tres conjunts de dades obertes de l'Ajuntament de Barcelona (població per lloc de naixement, estructura dels domicilis i població per edat quinquennal i lloc de naixement), seguit d'una síntesi comunicativa.
2. **`exercici2.ipynb` — Model lineal de predicció demogràfica amb gradient descendent:** Implementació manual (sense `scikit-learn`) d'una regressió lineal entrenada amb gradient descendent sobre dades estandarditzades (z-score) per estimar en quin any la població nascuda a l'exterior («Resta del món» + «Resta de la UE») igualarà o superarà la població nascuda a Barcelona, la resta de Catalunya i la resta d'Espanya.

---

## 2. Estructura del projecte i de les dades

El projecte s'organitza dins del directori `P1/` amb l'estructura següent:

```text
P1/
├── README.md                              ← Enunciat i instruccions generals de la pràctica
├── spec.md                                ← Especificació del projecte, estructura i flux de treball
├── tasks.md                               ← Desglossament detallat de tasques amb caselles de verificació
├── article ARA.pdf                        ← Article de context periodístic sobre les dades del padró
├── exercici1.ipynb                        ← Notebook 1: Anàlisi exploratòria (Parts 1 a 6)
├── exercici2.ipynb                        ← Notebook 2: Regressió lineal amb gradient descendent (Parts 1 a 7)
├── .venv/                                 ← Entorn virtual de Python amb els paquets necessaris
└── data/                                  ← Fitxers auxiliars i conjunts de dades (Open Data BCN)
    ├── pad_dimensions.csv                 ← Diccionari de codis per descodificar dimensions (LLOC_NAIX, SEXE, EDAT_Q, TIPUS_DOMICILI...)
    ├── poblacio_lloc_naix/                ← 30 fitxers CSV anuals (1997–2026) de població per lloc de naixement i sexe
    ├── edat_lloc_naix/                    ← Fitxer 2026_edat_lloc_naix.csv (població per edat quinquennal, lloc de naixement i sexe)
    └── domicilis_estructura/              ← Fitxer 2026_domicilis_estructura.csv (estructura familiar de les llars el 2026)
```

### Característiques dels conjunts de dades (`./data`)
- **Nivell de desagregació:** Secció censal (`Codi_Districte`, `Nom_Districte`, `Codi_Barri`, `Nom_Barri`, `AEB`, `Seccio_Censal`).
- **Valors emmascarats:** La columna `Valor` pot contenir la cadena `'..'` per protegir l'anonimat estadístic quan el recompte és molt baix. Cal convertir-la a numèrica amb `pd.to_numeric(..., errors='coerce')` (tractant `'..'` com a `NaN`).
- **Codis de dimensió (`pad_dimensions.csv`):**
  - `LLOC_NAIX` (dimensió 4): `1` (Barcelona ciutat), `2` (Resta de Catalunya), `3` (Resta d'Espanya), `4` (Resta de la Unió Europea), `5` (Resta del món), `6` (No consta).
  - `SEXE` (dimensió 1): `1` (Dona / Home segons el diccionari `pad_dimensions.csv`), `2`.
  - `EDAT_Q` (dimensió 3): Grups quinquennals d'edat (`0` per `<5 anys` fins a `20` per `≥100 anys`, i `21` per `No consta`).
  - `TIPUS_DOMICILI` (dimensió 16): Codis `1` a `12` segons la composició de la llar (unipersonals, parelles, llars amb menors, etc.).

---

## 3. Especificació funcional per mòduls

### Mòdul 1: `exercici1.ipynb` (Anàlisi exploratòria)
- **Part 1 — Exploració inicial (2026):**
  - Carregar `2026_poblacio_lloc_naix.csv` i inspeccionar tipus de dades (`info()`), valors nuls (`isna().sum()`), percentatge de valors emmascarats `'..'` i valors únics de `LLOC_NAIX`.
  - Consultar `pad_dimensions.csv` per obtenir `lloc_naix_dict` i calcular la població total de Barcelona el 2026 filtrant els codis agregats `1–6`.
- **Part 2 — Neteja i transformació (2026):**
  - Implementar `netejar_poblacio(path)` que converteixi `Valor` a numèric, filtri `LLOC_NAIX` en `1..6` i afegeixi la columna `Any` extreta de `Data_Referencia`.
  - Agregar a nivell de ciutat per `(Any, LLOC_NAIX, SEXE)` amb `groupby` (12 files per al 2026).
  - Unir amb `lloc_naix_dict` mitjançant `merge` i construir una taula resum amb `pd.pivot_table` (files: lloc de naixement, columnes: sexe, amb fila/columna de totals).
- **Part 3 — Sèrie temporal (1997–2026):**
  - Carregar i concatenar els 30 fitxers CSV de `poblacio_lloc_naix/` en `df_serie`.
  - Verificar la consistència del nombre de files per any i graficar l'evolució de la població total anual (1997–2026).
  - Agregar per `(Any, LLOC_NAIX)` en `serie_lloc` (usant *method chaining*) i generar el gràfic de 4 línies (`Barcelona ciutat`, `Resta de Catalunya`, `Resta d'Espanya`, i `Resta del món` agrupant els codis 4, 5 i 6), amb anotacions dels valors del 2026 i d'una fita històrica (crisi 2008 o pandèmia 2020), desant `grafic_serie.png`.
- **Part 4 — Estructura dels domicilis (2026):**
  - Carregar i explorar `2026_domicilis_estructura.csv` i el diccionari `tipus_dict` (`TIPUS_DOMICILI`).
  - Agregar el total de domicilis per tipus, unir amb les etiquetes i ordenar de major a menor.
  - Crear un gràfic de barres horitzontals amb percentatges i colors diferenciats per tipologia de llar.
  - Calcular indicadors clau: llars unipersonals, llars amb menors (codis 9–12) i ràtio dones soles vs. homes sols ≥ 65 anys.
- **Part 5 — Edat mitjana per lloc de naixement (2026):**
  - Carregar `2026_edat_lloc_naix.csv` i definir el diccionari `MIDPOINTS` (punts migs dels grups 0–19 com `2, 7, ..., 97`, grup 20 com `100` i grup 21 com `None`).
  - Implementar `edat_mitjana_per_lloc(df, midpoints)` per calcular l'edat mitjana ponderada excloent `EDAT_Q == 21`.
  - Visualitzar l'edat mitjana per grup en un gràfic de barres verticals amb la línia d'edat mitjana global de la ciutat (`grafic_edat_mitjana.png`).
- **Part 6 — Síntesi i comunicació:**
  - Redactar l'informe breu (300–500 paraules), generar el gràfic polit final i plantejar una pregunta oberta.

### Mòdul 2: `exercici2.ipynb` (Model lineal amb gradient descendent)
- **Part 1 — Dos grups de comparació:**
  - Construir `df_comparacio` agrupant els codis `1, 2, 3` com a `local` i els codis `4, 5` com a `exterior` per a cada any (1997–2026), calculant `diferencia = local - exterior`.
- **Part 2 — Visualització de les tendències:**
  - Graficar les dues sèries (`local` i `exterior`) entre 1997 i 2026 amb l'eix Y en milers i anotació del valor final (2026).
- **Parts 3 i 4 — Implementació del gradient descendent:**
  - Estandarditzar `anys` (`t_norm`) i `difs` (`d_norm`) amb z-score ($\mu \approx 0, \sigma \approx 1$), guardant `t_mean, t_std, d_mean, d_std`.
  - Implementar `cost_mse(m, b, t, y)` i verificar que amb $m=0, b=0$ retorna $\approx 1.0$.
  - Implementar `compute_gradients(m, b, t, y)` per a $\frac{\partial J}{\partial m}$ i $\frac{\partial J}{\partial b}$.
  - Executar el bucle d'entrenament ajustant `lr` i `n_iter` fins a la convergència, i graficar la corba d'aprenentatge (MSE vs. iteració).
  - Desnormalitzar els paràmetres per obtenir `m_orig` i `b_orig` en l'escala original i validar-los amb `np.polyfit(anys, difs, 1)` (error relatiu $< 1\%$).
- **Parts 5, 6 i 7 — Punt de creuament, projecció i interpretació:**
  - Calcular analíticament l'any de creuament $t^* = -b_{\text{orig}} / m_{\text{orig}}$.
  - Generar el gràfic de projecció fins més enllà de $t^*$ (`grafic_projeccio.png`) amb els punts observats, la recta extrapolada, la línia zero i l'anotació de l'any de creuament.
  - Completar les preguntes d'interpretació crítica.

---

## 4. Requisits tècnics i Criteris d'acceptació

- **Entorn d'execució:** Python 3 amb els paquets `pandas`, `numpy`, `matplotlib` i `jupyter` instal·lats a `.venv/`.
- **Criteris d'acceptació:**
  1. Totes les cel·les de codi marcades amb 🔧 dels dos notebooks s'executen seqüencialment des de l'inici fins al final sense cap excepció ni error.
  2. Totes les comprovacions internes (`assert`, verificació de dimensions, error relatiu $< 1\%$ respecte a `np.polyfit`) es compleixen.
  3. Tots els gràfics es generen amb títol, etiquetes d'eixos, llegenda i formatació adequada, i es desen els fitxers `.png` requerits (`grafic_serie.png`, `grafic_edat_mitjana.png`, `grafic_projeccio.png`).
  4. El codi és clar, llegible, comentat i fidel a les bones pràctiques de `pandas`, `numpy` i `matplotlib`.

---

## 5. Metodologia de treball, prova i verificació de tasques

El desenvolupament del projecte es regeix de manera estricta pel fitxer `tasks.md`, on cada gran bloc dels notebooks es divideix en tasques petites i manejables amb una casella de verificació (`- [ ]`).

> **Regla obligatòria de verificació i marcatge:**
> 1. Les tasques de `tasks.md` s'han de resoldre **en ordre seqüencial**.
> 2. **Després d'acabar cada tasca de `tasks.md`, s'ha de provar i executar el codi corresponent** (comprovant que no produeix cap error i que el resultat o gràfic obtingut és l'esperat segons els criteris d'acceptació).
> 3. **Només quan la prova hagi funcionat correctament, es marcarà la casella de la tasca com a completada (`- [x]`) a `tasks.md`** abans de passar a la tasca següent.
