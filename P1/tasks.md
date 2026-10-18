# Tasques del projecte — P1: El padró de Barcelona

> **Nota de flux de treball:** Tal com s'especifica a `spec.md`, després de completar cada tasca s'ha d'executar i provar que funciona correctament sense errors; un cop verificada, cal marcar la casella corresponent amb `[x]`.

---

## Fase 0. Preparació de l'entorn i dades

- [x] Verificar l'estructura de la carpeta `./data` (`pad_dimensions.csv`, `poblacio_lloc_naix/`, `edat_lloc_naix/`, `domicilis_estructura/`)
- [x] Configurar l'entorn virtual de Python (`.venv`) i instal·lar els paquets necessaris (`pandas`, `numpy`, `matplotlib`, `jupyter`)
- [x] Verificar que la cel·la de configuració inicial d'`exercici1.ipynb` i `exercici2.ipynb` s'executa sense errors

---

## Exercici 1 (`exercici1.ipynb`) — Anàlisi exploratòria del padró (1997–2026)

### Part 1. Exploració inicial: un sol any (2026)

- [x] **1.1 Càrrega del fitxer:** Executar la càrrega de `2026_poblacio_lloc_naix.csv` a `df_2026` i comprovar que té dimensió `(11082, 10)`
- [x] **1.2.a Columnes i tipus:** Inspeccionar les columnes i tipus de dades de `df_2026` amb `df_2026.info()`
- [x] **1.2.b Valors nuls:** Comptar els valors nuls (`NaN`) per columna amb `df_2026.isna().sum()`
- [x] **1.2.c Valors emmascarats (`..`):** Comptar quantes files tenen `Valor == '..'` i calcular quin percentatge representen sobre el total
- [x] **1.2.d Valors únics de `LLOC_NAIX`:** Llistar i comptar els valors únics de `LLOC_NAIX` a `df_2026`
- [x] **1.3 Diccionari de codis:** Carregar `pad_dimensions.csv` a `dims` i extreure el diccionari `lloc_naix_dict` per a la dimensió `LLOC_NAIX`
- [x] **1.4.a Categories agregades:** Identificar i mostrar els 6 codis agregats (`1` a `6`) de `LLOC_NAIX` i el seu significat
- [x] **1.4.b Població total 2026:** Corregir i executar el càlcul de la població total de Barcelona l'any 2026 sobre `df_2026` (convertint `Valor` a numèric amb `pd.to_numeric(..., errors='coerce')` i sumant els codis 1–6)
- [x] **1.4.c Hipòtesi sobre la diferència amb la xifra oficial:** Verificar el comentari explicatiu sobre l'efecte de les dades emmascarades (`..`)

### Part 2. Neteja i transformació (2026)

- [x] **2.1 Funció de neteja (`netejar_poblacio`):** Implementar la funció `netejar_poblacio(path)` (lectura del CSV, conversió de `Valor` a numèric, filtratge de `LLOC_NAIX` entre 1 i 6, extracció de la columna `Any`) i provar-la amb l'any 2026 (`df_net`)
- [x] **2.2 Agregació a nivell de ciutat:** Agrupar `df_net` per `["Any", "LLOC_NAIX", "SEXE"]` sumant `Valor` per obtenir `df_ciutat` i verificar que té exactament 12 files
- [x] **2.3 Unió amb el diccionari:** Unir `df_ciutat` amb `lloc_naix_dict` usant `pd.merge` per afegir la columna descriptiva `Lloc_Naix_Label`
- [x] **2.4 Taula resum (pivot table):** Crear una taula pivot (`pd.pivot_table`) per al 2026 amb el lloc de naixement a les files, el sexe a les columnes i els totals (`margins=True`)
- [x] **2.5 Reflexió sobre qualitat de les dades:** Completar o revisar la cel·la Markdown sobre les decisions de neteja i l'impacte dels valors `..`

### Part 3. Sèrie temporal 1997–2026

- [x] **3.1 Càrrega de tots els anys:** Usar `glob.glob()` i `netejar_poblacio()` per carregar i concatenar els 30 fitxers anuals (1997–2026) en `df_serie`
- [x] **3.2.a Consistència del nombre de files per any:** Comprovar el nombre de files per any a `df_serie` i identificar si algun any presenta diferències
- [x] **3.2.b Evolució de la població total (1997–2026):** Calcular la població total per any i representar-la en un gràfic de línies
- [x] **3.3 Agregació per lloc de naixement (`serie_lloc`):** Crear el DataFrame `serie_lloc` amb les columnes `Any`, `LLOC_NAIX`, `Lloc_Naix_Label` i `Total` mitjançant encadenament d'operacions (*method chaining*)
- [x] **3.4 Visualització de la sèrie temporal (4 línies):** Generar el gràfic de línies (1997–2026) per als 4 grups (`Barcelona ciutat`, `Resta de Catalunya`, `Resta d'Espanya`, i `Resta del món` sumant codis 4, 5 i 6), amb etiquetes en català, valor final (2026) a la dreta, anotació d'un moment clau i desar-lo a `grafic_serie.png`

### Part 4. Estructura dels domicilis (2026)

- [x] **4.1 Càrrega i exploració de domicilis:** Carregar `2026_domicilis_estructura.csv`, convertir `Valor` si cal, i inspeccionar `shape`, `dtypes`, valors nuls i valors únics de `TIPUS_DOMICILI`
- [x] **4.2 Diccionari `TIPUS_DOMICILI`:** Executar la cel·la que extreu `tipus_dict` (dimensió 16 de `pad_dimensions.csv`)
- [x] **4.3 Agregació i unió de domicilis:** Calcular el total de domicilis per `TIPUS_DOMICILI`, unir amb `tipus_dict` i ordenar de major a menor nombre de domicilis
- [x] **4.4 Gràfic d'estructura dels domicilis:** Crear el gràfic de barres horitzontals amb els 12 tipus de domicili, percentatge sobre el total al costat de cada barra i colors diferenciats per tipologia de llar
- [x] **4.5 Indicadors clau de domicilis:** Calcular i imprimir: (a) nombre i % de llars unipersonals, (b) nombre i % de llars amb menors (codis 9–12), i (c) comparació i ràtio entre dones soles ≥ 65 anys i homes sols ≥ 65 anys

### Part 5. Edat mitjana per lloc de naixement (2026)

- [x] **5.1 i 5.2 Càrrega del dataset d'edat i diccionari `EDAT_Q`:** Executar les cel·les de càrrega de `2026_edat_lloc_naix.csv` (`df_edat`) i del diccionari `edat_q_dict`
- [x] **5.3 Definició de `MIDPOINTS`:** Completar el diccionari `MIDPOINTS` (grups 0–19 amb punt mig `5*i + 2`, grup 20 amb `100`, grup 21 amb `None`) i verificar que passa l'`assert`
- [x] **5.4 Funció `edat_mitjana_per_lloc`:** Implementar `edat_mitjana_per_lloc(df, midpoints)` per calcular l'edat mitjana ponderada de cada `LLOC_NAIX` (1–6) excloent `EDAT_Q == 21`, i unir el resultat amb `lloc_naix_dict`
- [x] **5.5.a Gràfic d'edat mitjana:** Crear el gràfic de barres verticals amb l'edat mitjana per lloc de naixement, valor numèric sobre cada barra, línia horitzontal discontínua amb l'edat mitjana global de la ciutat, i desar-lo a `grafic_edat_mitjana.png`
- [x] **5.5.b Interpretació de l'edat mitjana:** Completar o revisar l'anàlisi qualitativa a la cel·la Markdown

### Part 6. Síntesi i comunicació

- [x] **6.1 Informe breu:** Completar o revisar l'informe en Markdown (300–500 paraules) responent les 4 preguntes plantejades
- [x] **6.2 El millor gràfic:** Generar la versió polida i completa del gràfic escollit (amb títol, subtítol, etiquetes, llegenda i font) i la seva justificació
- [x] **6.3 Pregunta oberta:** Completar o revisar la pregunta oberta i el dataset addicional proposat

---

## Exercici 2 (`exercici2.ipynb`) — Model lineal de predicció demogràfica

### Configuració i Part 1. Dos grups de comparació

- [x] **0. Càrrega inicial de la sèrie temporal:** Executar les dues primeres cel·les de codi d'`exercici2.ipynb` per carregar `serie_anual` (30 anys, 1997–2026)
- [x] **1.1 Creació de `df_comparacio`:** Agrupar els codis `1, 2, 3` com a `local` i els codis `4, 5` com a `exterior`, fer el pivot per any i calcular `diferencia = local - exterior`

### Part 2. Visualització de les tendències

- [x] **2.1 Gràfic comparatiu `local` vs `exterior` (1997–2026):** Crear el gràfic de 2 línies amb colors diferenciats, títol, eixos (eix Y en milers amb `FuncFormatter`), llegenda i anotació del valor final (2026)

### Part 4. Implementació del gradient descendent

- [x] **4.1 Estandardització (z-score):** Calcular `t_mean, t_std` i `d_mean, d_std`, obtenir `t_norm` i `d_norm`, i verificar que tenen mitjana $\approx 0$ i desviació estàndard $\approx 1$
- [x] **4.2 Funció de cost (`cost_mse`):** Implementar `cost_mse(m, b, t, y)` i verificar que `cost_mse(0, 0, t_norm, d_norm)` retorna $\approx 1.0$
- [x] **4.3 Càlcul dels gradients (`compute_gradients`):** Implementar `compute_gradients(m, b, t, y)` i verificar que retorna gradients no nuls per a $m=0, b=0$
- [x] **4.4 Bucle d'entrenament del gradient descendent:** Escollir `lr` i `n_iter` adequats, implementar el bucle d'actualització de `m_norm` i `b_norm` guardant l'historial a `history`, i comprovar que el cost convergeix
- [x] **4.5 Gràfic de la corba d'aprenentatge:** Representar l'evolució del MSE al llarg de les iteracions i verificar que descendeix i s'aplana sense oscil·lacions
- [x] **4.6 Conversió de paràmetres a l'escala original:** Calcular `m_orig` i `b_orig` a partir de `m_norm`, `b_norm`, `t_mean`, `t_std`, `d_mean` i `d_std`
- [x] **4.7 Validació amb `np.polyfit`:** Executar la cel·la de validació i comprovar que l'error relatiu de `m_orig` i `b_orig` respecte a `np.polyfit` és inferior a l'1% (`< 1%`)

### Part 5 i Part 6. Punt de creuament i projecció

- [x] **5.1 Càlcul de l'any de creuament:** Calcular `any_creuament = -b_orig / m_orig` i mostrar l'any previst en què el grup exterior igualarà el grup local
- [x] **6.1 Gràfic final amb projecció (`grafic_projeccio.png`):** Representar els punts observats de la diferència (1997–2026), la recta del model extrapolada fins més enllà de `any_creuament`, la línia horitzontal zero, el punt de creuament anotat i desar la figura a `grafic_projeccio.png`

### Part 7. Interpretació crítica

- [x] **7.a Predicció i grau de confiança:** Completar o revisar la resposta a l'apartat (a)
- [x] **7.b Influència de `lr` i `n_iter`:** Completar o revisar la resposta a l'apartat (b)
- [x] **7.c Limitacions de l'assumpció lineal (crisi 2008, pandèmia 2020):** Completar o revisar la resposta a l'apartat (c)

---

## Fase Final. Verificació global d'entrega

- [x] Executar íntegrament `exercici1.ipynb` i `exercici2.ipynb` per garantir que totes les cel·les tenen les seves sortides i gràfics visibles i actualitzats sense cap error
