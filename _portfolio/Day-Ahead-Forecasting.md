---
title: "Day-Ahead Forecasting for German Power"
excerpt: "An end-to-end forecasting pipeline for the German/Luxembourg power market, from public ENTSO-E and EEX data to day-ahead price forecasts and prompt-curve fair-value views."
collection: portfolio
---

Electricity markets are different from many financial markets because every contract ultimately connects back to physical delivery. Generators offer electricity into the market, consumers and suppliers need power to meet demand, and trading companies sit in the middle managing risk, buying and selling around expected system conditions. In modern European power markets, that middle layer is increasingly quantitative: traders use forecasting systems, algorithmic strategies, and AI models to estimate where power should clear before committing capital.

The core short-term horizons are day-ahead, intraday, and balancing. In the day-ahead market, participants trade electricity for delivery on the next day, usually as hourly or sub-hourly products. Intraday markets allow participants to adjust positions closer to real time as weather, demand, plant availability, and grid constraints change. Balancing markets then handle the final physical deviations needed to keep the system stable.

Europe is split into bidding zones rather than one uniform electricity price. Germany/Luxembourg, France, the Netherlands, Belgium, the Nordics, and other regions each have their own local supply-demand balance, but they are connected by interconnectors and market coupling. When cross-border capacity is available, cheaper power can flow from one zone to another and prices can converge. When the grid is constrained, prices separate. This is why a German day-ahead model should not only look at German load and renewables, but also at neighboring system conditions, fuel and carbon prices, and signals such as French nuclear availability.

## Project Goal

This project builds an end-to-end forecasting pipeline for the German/Luxembourg day-ahead electricity price. The goal was not only to predict the next hourly price, but to turn those forecasts into a format that is useful for a trading desk: weekly and monthly fair-value views for baseload, peak, and off-peak power.

Repository: [Day-Ahead-Forecasting](https://github.com/Mohamad-Abdulkadir/Day-Ahead-Forecasting)

## My Approach

I built the pipeline around public market and power-system data:

- ENTSO-E day-ahead prices for Germany/Luxembourg as the target.
- ENTSO-E day-ahead total load forecast.
- ENTSO-E wind and solar generation forecasts.
- ENTSO-E actual load, used only through lagged features to avoid leakage.
- French nuclear generation as a neighboring-market availability proxy.
- EEX EUA auction prices as a carbon-cost signal.

The pipeline has six layers:

1. **Ingestion:** Download public ENTSO-E XML data and EEX auction spreadsheets from configured API definitions.
2. **Normalization:** Convert mixed 15-minute and hourly market time units into aligned hourly tables in the German delivery calendar.
3. **Quality assurance:** Profile each raw dataset, run deterministic validation checks, and optionally generate extra QA rules with Gemini.
4. **Feature engineering:** Build residual load, renewable share, calendar features, price/load/carbon lags, and missingness flags.
5. **Modeling:** Compare simple baselines and machine learning models with walk-forward validation.
6. **Prompt-curve translation:** Aggregate hourly forecasts into prompt-week and prompt-month baseload, peak, and off-peak fair values.

The most important feature was residual load: forecast demand minus forecast renewable generation. This captures the physical tightness of the system. When residual load is high, dispatchable generation becomes more important and scarcity pricing risk rises. When renewable share is high, prices tend to fall and negative-price risk increases.

## Modeling Results

The final modeling dataset contained 23,670 hourly rows and 31 engineered features after lag warm-up and data cleaning. The held-out comparison window started on `2025-08-01T00:00:00Z` and contained 1,458 hourly observations.

The exploratory analysis showed why residual load and renewable share were central to the model. The dense middle of the market is fairly structured, but high residual-load periods and high-renewable periods create very different price regimes.

![Day-ahead price drivers](/images/day-ahead-forecasting/price_driver_hexbins.png)

The strongest walk-forward result came from XGBoost:

| Model | Walk-forward MAE | Held-out MAE |
| --- | ---: | ---: |
| XGBoost | 13.646 EUR/MWh | 11.417 EUR/MWh |
| LightGBM | 13.796 EUR/MWh | 11.055 EUR/MWh |
| CatBoost | 14.155 EUR/MWh | 11.789 EUR/MWh |
| Linear ridge baseline | 16.178 EUR/MWh | 14.967 EUR/MWh |

LightGBM had the best held-out hourly MAE, while XGBoost had the best walk-forward MAE. I kept both in the diagnostic output, and the submission export used the LightGBM forecast column.

![Actual vs predicted day-ahead prices](/images/day-ahead-forecasting/actual_vs_predicted_da_price.png)

The QA layer also mattered. Across the raw datasets, the pipeline ran 144 checks: 132 passed, 12 produced warnings, and none failed. Most warnings were expected market-data issues such as mixed resolutions, partial coverage, or price outliers. This reinforced one of the main lessons of the project: in power forecasting, better data alignment and leakage control can matter more than adding another complex model.

The tail diagnostics were also important. The market is structured around physical fundamentals, but the tails are not gentle: high residual load increases high-price event risk, while high renewable share increases negative-price event risk.

![Tail event rates](/images/day-ahead-forecasting/tail_event_rates.png)

## Prompt Curve Translation

An hourly day-ahead forecast is useful, but trading desks often think in delivery products such as prompt week and prompt month. I added a translation layer that converts hourly forecasts into:

- Baseload: all delivery hours.
- Peak: weekday 08:00-19:00 local time.
- Off-peak: all other hours.

For each period and block, the pipeline averages the hourly forecasts into a fair value. It then builds an uncertainty band using historical forecast error for that block:

`fair value +/- block MAE`

The output can be compared with a traded prompt-week or prompt-month market price:

- If market price is below the low band, the contract looks cheap versus the model.
- If market price is above the high band, the contract looks rich versus the model.
- If market price is inside the band, the model does not give a strong directional view.

For the offline case study, I used held-out realized day-ahead averages as ground truth, not as live forward prices. The prompt-curve output produced 36 rows across week/month periods and baseload/peak/off-peak blocks.

The block-level calibration on the held-out hourly forecast was:

| Block | Calibration rows | MAE |
| --- | ---: | ---: |
| Baseload | 1,458 | 11.05 EUR/MWh |
| Peak | 514 | 14.44 EUR/MWh |
| Off-peak | 944 | 9.21 EUR/MWh |

On the held-out prompt-period check, all selected weekly and monthly averages landed inside the MAE bands. Monthly baseload MAE was 2.10 EUR/MWh, monthly peak MAE was 5.40 EUR/MWh, and monthly off-peak MAE was 0.99 EUR/MWh. Weekly errors were larger, especially for peak hours, which makes sense because shorter delivery periods are more sensitive to weather and operational revisions.

## References

- [ENTSO-E Single Day-Ahead Coupling](https://www.entsoe.eu/network_codes/cacm/implementation/sdac/)
- [EPEX SPOT trading products](https://www.epexspot.com/en/tradingproducts)
- [ENTSO-E Transparency Platform](https://www.entsoe.eu/data/transparency-platform/)
- [ACER market timeframes](https://www.acer.europa.eu/electricity/market-rules/market-rules-different-electricity-market-timeframes)
