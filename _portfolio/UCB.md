---
title: "UCB Implementation"
excerpt: "Implementation of Sliding-Window UCB and Discounted UCB."
collection: portfolio
---

## Overview

The Upper Confidence Bound (UCB) algorithm is a popular approach in the multi-armed bandit problem, balancing exploration and exploitation. This project implements two variants:

1. Sliding-Window UCB: Adapts to non-stationary environments by considering only recent observations within a fixed window.
2. Discounted UCB: Gives more weight to recent observations, allowing for adaptation to changing reward distributions.

Both algorithms were introduced in this paper [Weighted Linear Bandits for Non-Stationary
Environments](https://arxiv.org/pdf/1909.09146).

These implementations serve as baselines for comparing our custom algorithm's performance in stochastic dynamic environments.


The complete implementation and detailed code is in this [Kaggle notebook](https://www.kaggle.com/code/mohammedabdulkadir88/sliding-window-discounted-linucb).

## Results

![UCB Results](/images/results_cb.png)

The image shows the cumulative regret over time for both UCB variants compared to a standard UCB algorithm. 

- **Sliding-Window UCB adapts faster to abrupt changes in reward distributions.**
- **Discounted UCB shows smoother adaptation to gradual changes.**
- **Both variants outperform standard UCB in non-stationary environments.**