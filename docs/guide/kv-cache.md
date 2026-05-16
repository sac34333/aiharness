---
title: KV Cache — GPU-Level Caching
description: How KV (key-value) caching works inside LLMs, vLLM, LMCache, and NVIDIA unified memory. The foundation of inference speed.
---

# KV Cache

> The caching that happens inside the model — before tokens even leave the GPU.

## What Is KV Cache?

When a transformer processes a prompt, it computes key and value matrices for every token in every attention layer. For a long prompt, this is expensive. KV Cache stores these matrices so they don't need to be recomputed on subsequent calls with the same prefix.

**Result:** Dramatically faster inference for repeated or shared prompt prefixes.

## Where It Lives

- **Inside the GPU** — KV cache lives in GPU VRAM during inference
- **Managed by the serving framework** — vLLM, TGI, LMCache, NVIDIA TensorRT-LLM

## vLLM and Paged Attention

vLLM introduced "paged attention" — KV cache is stored in non-contiguous memory pages (like virtual memory in OS), enabling much higher utilisation and enabling multiple requests to share cache blocks.

```python
# vLLM with KV cache configuration
from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3-8b",
    gpu_memory_utilization=0.90,  # how much VRAM to reserve for KV cache
    max_model_len=8192,
)
```

## Production Trap

::: warning
Provisioning GPUs without accounting for KV cache memory. A model may fit in VRAM for weights — but KV cache for long contexts will OOM you in production. Rule of thumb: reserve 30-40% of VRAM for KV cache.
:::

## Recall Hook

> KV Cache = don't recompute what you already computed. Design prompts with stable prefixes so the cache actually hits.

---

*Next: [Prompt Caching →](/guide/prompt-caching)*
