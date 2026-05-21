import type { Product } from "@/context/store";
import panelImg from "@/assets/panel.jpg";
import inverterImg from "@/assets/inverter.jpg";
import batteryImg from "@/assets/battery.jpg";

export const panels: Product[] = [
  { id: "mustang-595", name: "Inverex Mustang 595W", series: "Mustang Series", category: "panel", watts: 595, tags: ["Bifacial", "N-Type", "Steel Frame"], image: panelImg },
  { id: "mustang-610", name: "Inverex Mustang 610W", series: "Mustang Series", category: "panel", watts: 610, tags: ["Bifacial", "N-Type", "Steel Frame"], image: panelImg },
  { id: "mustang-720", name: "Inverex Mustang 720W", series: "Mustang Series", category: "panel", watts: 720, tags: ["Bifacial", "Steel Frame"], image: panelImg },
  { id: "ja-580", name: "JA Solar DeepBlue 580W", series: "DeepBlue 4.0", category: "panel", watts: 580, tags: ["N-Type", "Mono PERC"], image: panelImg },
  { id: "longi-himo7", name: "Longi Hi-MO 7 590W", series: "Hi-MO 7", category: "panel", watts: 590, tags: ["Bifacial", "HPBC"], image: panelImg },
  { id: "longi-himox10", name: "Longi Hi-MO X10 660W", series: "Hi-MO X10", category: "panel", watts: 660, tags: ["Back-Contact", "HPDC"], image: panelImg },
];

export const invertersHybrid: Product[] = [
  { id: "veyron-1.6", name: "Veyron II 1.6kW", series: "Veyron II", category: "inverter", watts: 1600, tags: ["Hybrid", "1-Phase"], image: inverterImg },
  { id: "veyron-3", name: "Veyron II 3kW", series: "Veyron II", category: "inverter", watts: 3000, tags: ["Hybrid", "1-Phase"], image: inverterImg },
  { id: "veyron-6", name: "Veyron II 6kW", series: "Veyron II", category: "inverter", watts: 6000, tags: ["Hybrid", "1-Phase"], image: inverterImg },
  { id: "yukon-5", name: "Yukon II 5kW", series: "Yukon II", category: "inverter", watts: 5000, tags: ["Hybrid", "Wifi"], image: inverterImg },
  { id: "nitrox-10", name: "Nitrox Hybrid 10kW", series: "Nitrox", category: "inverter", watts: 10000, tags: ["Hybrid", "3-Phase"], image: inverterImg },
];

export const invertersOnGrid: Product[] = [
  { id: "nitrox-25", name: "Nitrox On-Grid 25kW", series: "Nitrox", category: "inverter", watts: 25000, tags: ["On-Grid", "3-Phase"], image: inverterImg },
  { id: "nitrox-60", name: "Nitrox On-Grid 60kW", series: "Nitrox", category: "inverter", watts: 60000, tags: ["On-Grid", "3-Phase"], image: inverterImg },
  { id: "nitrox-136", name: "Nitrox On-Grid 136kW", series: "Nitrox", category: "inverter", watts: 136000, tags: ["On-Grid", "Industrial"], image: inverterImg },
];

export const batteriesOutdoor: Product[] = [
  { id: "bat-ip65-200", name: "Aegis 200Ah IP65", category: "battery", watts: 10240, tags: ["IP65", "Outdoor Shield", "LFP"], image: batteryImg },
  { id: "bat-ip65-280", name: "Aegis 280Ah IP65", category: "battery", watts: 14336, tags: ["IP65", "Outdoor Shield", "LFP"], image: batteryImg },
  { id: "bat-ip65-314", name: "Aegis 314Ah IP65", category: "battery", watts: 16077, tags: ["IP65", "Outdoor Shield", "LFP"], image: batteryImg },
];

export const batteriesIndoor: Product[] = [
  { id: "bat-ip21-100", name: "Aegis 100Ah IP21", category: "battery", watts: 5120, tags: ["IP21", "Indoor", "LFP"], image: batteryImg },
  { id: "bat-ip21-200", name: "Aegis 200Ah IP21", category: "battery", watts: 10240, tags: ["IP21", "Indoor", "LFP"], image: batteryImg },
  { id: "bat-ip21-280", name: "Aegis 280Ah IP21", category: "battery", watts: 14336, tags: ["IP21", "Indoor", "LFP"], image: batteryImg },
];
