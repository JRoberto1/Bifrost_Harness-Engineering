---
id: data-science
version: 1.0.0
triggers: ["data science", "ciência de dados", "pandas", "numpy", "jupyter", "notebook", "matplotlib", "sklearn", "machine learning", "ml", "dataset", "dataframe", "análise de dados", "visualização"]
domain: api
estimated_tokens: 740
compatible_runtimes: [claude-code, antigravity, opencode, cursor]
last_updated: 2026-05-28
---

# Directive: Data Science

## Objetivo
Garantir reprodutibilidade, clareza e corretude em análises de dados
e pipelines de machine learning.

## Regra Fundamental

Uma análise que não pode ser reproduzida não é ciência — é um resultado.
Seed, versões de dependências e ordem de operações devem ser explícitos.

## Reprodutibilidade

```python
import random
import numpy as np

SEED = 42
random.seed(SEED)
np.random.seed(SEED)

# Se usar TensorFlow/PyTorch:
# tf.random.set_seed(SEED)
# torch.manual_seed(SEED)
```

Sempre fixe o seed antes de qualquer operação aleatória.
Documente a versão das dependências com requirements.txt ou pyproject.toml.

## Protocolo de Análise

### 1. Exploração (EDA)
Antes de qualquer modelagem:
- Shape, tipos, valores nulos: df.info(), df.describe()
- Distribuição das features: histogramas, boxplots
- Correlações: heatmap de correlação
- Outliers: IQR ou z-score
- Nunca assuma que os dados estão limpos

### 2. Limpeza
- Documente cada decisão de limpeza com comentário
- Nunca modifique o dataset original — sempre crie cópias
- Registre quantos registros foram removidos e por quê

```python
df_clean = df.copy()
df_clean = df_clean.dropna(subset=['target'])
print(f"Removidos {len(df) - len(df_clean)} registros com target nulo")
```

### 3. Feature Engineering
- Crie features em funções reutilizáveis, não inline
- Documente a intuição por trás de cada feature criada
- Evite data leakage — features não podem usar informação do futuro

### 4. Modelagem
- Sempre faça train/test split antes de qualquer transformação
- Fit do scaler/encoder apenas no train — transform no test
- Cross-validation para estimativa de performance
- Baseline simples antes de modelos complexos

```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=SEED, stratify=y
)
```

### 5. Avaliação
- Escolha a métrica certa para o problema:
  - Classificação desbalanceada → F1, AUC-ROC (não accuracy)
  - Regressão → RMSE, MAE (dependendo de outliers)
  - Ranking → NDCG, MAP
- Reporte sempre train e test performance juntos
- Diferença grande entre train e test → overfitting

## Notebooks — Boas Práticas

- Células em ordem de execução — notebook que só funciona
  fora de ordem é um bug
- Restart & Run All antes de commitar
- Outputs de células com dados sensíveis → limpe antes de commitar
- Para produção → converta para script .py, não use notebook

## Regras do Agente

- Nunca assuma que um dataset está balanceado sem verificar
- Sempre verifique data leakage antes de reportar performance
- Gráficos sempre com título, labels nos eixos e unidades
- Nunca delete outliers sem investigar se são erros ou valores reais

## Output Esperado

DATASET: [shape, tipos, nulos]
PROBLEMA: classificação | regressão | clustering | outro
BASELINE: [métrica e valor]
MODELO: [algoritmo escolhido e justificativa]
PERFORMANCE: train=[métrica] | test=[métrica]
RISCOS: [data leakage, overfitting, desbalanceamento]

## Aprendizados
<!-- Atualize quando encontrar padrões de análise recorrentes -->
- [data] [padrão identificado e solução aplicada]
