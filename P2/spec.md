El objetivo de este proyecto es construir un recomendador de peliculas en Python basado en matriz de factorizacion entrenado con el dataset de la carpeta src/data/. El fichero ratings.csv contiene las columnas userId, movieId, rating, timestamp y el fichero /movies.csv contiene las columnas movieId, title, genres. Las puntuaciones van de 0.5 a 5 avanzando en pasos de 0.5 y los generos se separan de la siguiente manera Action|Drama.

Para implementar la matriz de factorización con sesgos, se usa la siguiente formula que calcula la valoración predicha para el usuario.

r_ui = mu + b_u + b_i + p_u * q_i

Donde mu es la media global, b_u y b_i son los sesgos de usuario y pelicula respectivamente, y p_u y q_i representan las filas de las matrices de factores latentes.

Para minimizar el error cuadrático se usará la regularización L2 mediante el gradiente descendiente estocastico. Los gradientes se derivan con autograd y los hiperparametros deben ser configurables como indica la tabla:

|  Hiperparámetro |  Significado                | Valor por defecto |
|-----------      |-----------                  |-----------        |
|  k              | Número de factores latentes |  20               |
| lr              | Tasa de aprendizaje         | 0.005             |
| lambda_         | Factor de regularización L2 | 0.02              |
| epochs          | Número de épocas            | 20                |

## Requisitos funcionales

1. **Carga de datos**: leer `ratings.csv` y `movies.csv` y construir las estructuras que necesita el modelo, incluyendo la correspondencia entre identificadores originales e índices de matriz.
2. **División train/test**: separar las valoraciones en 80% entrenamiento y 20% test respetando el orden temporal, para evitar *data leakage*: para cada usuario, sus valoraciones se ordenan por timestamp y el 20% más reciente va a test, de manera que el modelo nunca aprende del futuro para predecir el pasado. Cada usuario debe conservar al menos una valoración en el train. Además, toda estadística o estructura derivada de los datos (media global $\mu$, correspondencia de índices, historial de películas vistas) se debe calcular solo a partir del train, y los hiperparámetros no se pueden ajustar mirando el test.
3. **Entrenamiento**: aprender $P$, $Q$, $b_u$, $b_i$ y $\mu$ con SGD, y retornar el historial de la pérdida (MSE de train) por época.
4. **Predicción**: dado un usuario y una película, retornar la valoración predicha dentro del intervalo [0.5, 5.0].
5. **Recomendación**: dado un `userId`, retornar las N películas con valoración predicha más alta que el usuario **no ha valorado**, con `movieId`, título, géneros y valoración predicha.
6. **Historial**: dado un `userId`, mostrar las películas que ha valorado, con título y géneros, ordenadas de más a menos valoradas.
7. **Evaluación**: calcular sobre el test **RMSE, MAE** y **NDCG@10** (usando la valoración real como relevancia). Debéis definir y justificar cómo tratáis los usuarios o películas del test que no aparecen en el train.
8. **Casos extremos**: el sistema no debe fallar ante usuarios o películas desconocidos (*cold-start*), predicciones fuera de rango ni usuarios sin candidatos a recomendar. Documentad cómo se trata cada caso.