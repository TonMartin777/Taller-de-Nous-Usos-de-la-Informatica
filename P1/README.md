# El padró de Barcelona: anàlisi exploratòria i predicció demogràfica

**Assignatura:** Taller de Nous Usos de la Informàtica (TNUI)
**Tema:** Anàlisi exploratòria de dades
**Eines:** Python · pandas · numpy · matplotlib · Jupyter
**Dades:** Padró Municipal d'Habitants · Ajuntament de Barcelona ([Open Data BCN](https://opendata-ajuntament.barcelona.cat/))

---

## Motivació

Qui viu a Barcelona? Com ha canviat la composició de la seva població en els darrers 30 anys? Quin model de convivència predomina a les llars de la ciutat? I, si les tendències actuals continuen, com serà la Barcelona del futur?

El **Padró Municipal d'Habitants** és el registre administratiu on consten totes les persones que viuen a la ciutat. L'Ajuntament de Barcelona en publica les dades en obert, i això ens permet respondre aquestes preguntes amb dades reals — amb tot el que això comporta: valors nuls, dades emmascarades per privacitat, codis que cal descodificar i fitxers que cal combinar.

Com a lectura de context, trobareu a la carpeta l'article **`article ARA.pdf`**, publicat al diari ARA, que analitza aquestes mateixes dades des d'una perspectiva periodística. Us pot servir d'inspiració per a la part d'interpretació i comunicació.

## Estructura de la pràctica

La pràctica consta de **dos exercicis** en forma de notebooks de Jupyter, que cal fer **en ordre**:

| Notebook          | Contingut                                         | Durada estimada |
| ----------------- | ------------------------------------------------- | --------------- |
| `exercici1.ipynb` | Anàlisi exploratòria del padró                    | 4 hores         |
| `exercici2.ipynb` | Model lineal de predicció amb gradient descendent | 2 hores         |

Dins dels notebooks, les cel·les marcades amb 🔧 contenen codi o text que heu d'escriure o completar; les marcades amb ✅ ja estan resoltes i serveixen de guia.

### Exercici 1 — Anàlisi exploratòria del padró (1997–2026)

Treballareu amb tres datasets del padró (població per lloc de naixement, població per edat i lloc de naixement, i estructura dels domicilis) per aprendre a:

1. **Carregar i explorar** fitxers CSV reals amb pandas.
2. **Identificar i gestionar** valors nuls i dades emmascarades (`..`).
3. **Unir** múltiples fitxers en un únic DataFrame coherent.
4. **Transformar i agregar** dades per obtenir indicadors demogràfics (`groupby`, `merge`, `pivot_table`).
5. **Visualitzar** tendències temporals i distribucions amb matplotlib.
6. **Comunicar** resultats amb claredat, justificant cada decisió.

L'exercici acaba amb un informe breu (300–500 paraules) i una reflexió crítica sobre les limitacions de les dades.

### Exercici 2 — Model lineal amb gradient descendent

A partir de la sèrie temporal construïda a l'exercici 1, implementareu **des de zero** (sense scikit-learn) una regressió lineal entrenada amb **gradient descendent** per respondre una pregunta concreta:

> *Si no canvien les tendències, quan superarà la població nascuda a la «Resta del món» la suma de la població nascuda a Barcelona, la resta de Catalunya i la resta d'Espanya?*

Aprendreu a:

1. **Estandarditzar** dades (z-score) i entendre per què cal fer-ho.
2. Implementar la **funció de cost** (MSE) i els seus **gradients** amb numpy.
3. Programar el **bucle d'entrenament** i ajustar la taxa d'aprenentatge (`lr`) i el nombre d'iteracions.
4. **Validar** el model comparant-lo amb `np.polyfit`.
5. **Extrapolar** el model, trobar el punt de creuament i discutir críticament la fiabilitat de la predicció.

## Les dades

Descomprimiu el fitxer `data.zip` **dins de la carpeta on hi ha els notebooks**, de manera que obtingueu aquesta estructura:

```
exercici/
├── exercici1.ipynb
├── exercici2.ipynb
└── data/
    ├── pad_dimensions.csv              ← diccionari de codis
    ├── poblacio_lloc_naix/             ← un CSV per any (1997–2026)
    ├── edat_lloc_naix/                 ← població per edat quinquennal
    └── domicilis_estructura/           ← estructura de les llars
```

Punts importants sobre les dades:

- Les dades estan desagregades a nivell de **secció censal**.
- Els valors molt baixos apareixen emmascarats amb `..` per protegir la privacitat: caldrà decidir com tractar-los.
- Les columnes com `LLOC_NAIX`, `SEXE`, `EDAT_Q` o `TIPUS_DOMICILI` contenen **codis numèrics**; el significat de cada codi és al fitxer `pad_dimensions.csv`.

## Requisits tècnics

- Python 3 amb `pandas`, `numpy`, `matplotlib` i `jupyter`. Si feu servir Anaconda, ja ho teniu tot instal·lat. Si no:

```bash
pip install pandas numpy matplotlib jupyter
```

- Executeu els notebooks des de la carpeta `exercici/` perquè les rutes relatives (`./data`) funcionin.

## Ús d'ajuda i d'IA

- Els notebooks inclouen una guia de com trobar ajuda a la documentació oficial de pandas i matplotlib. Feu-la servir.
- Podeu utilitzar assistents d'IA com a suport per **entendre** conceptes o **desencallar-vos**, però heu de ser capaços d'explicar i defensar **tot** el codi que entregueu. Les reflexions i interpretacions escrites han de ser vostres.

## Entrega

Cal entregar els **dos notebooks completats** (`exercici1.ipynb` i `exercici2.ipynb`) amb:

- Totes les cel·les 🔧 resoltes i **executades** (amb les sortides visibles).
- Els gràfics generats i correctament etiquetats.
- Les respostes de text (reflexions, informe, interpretació crítica) escrites a les cel·les Markdown corresponents.

# 

Bona feina! 📊
