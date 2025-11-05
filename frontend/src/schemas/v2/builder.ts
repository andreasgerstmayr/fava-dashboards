import { Config } from "./dashboard";

export function defineConfig(config: Config): Config {
  return config;
}

// class DashboardBuilder<DashboardVariables extends VariableDefinitions> {
//   private dashboard: Dashboard<DashboardVariables>;

//   constructor(dashboard: Omit<Dashboard<DashboardVariables>, "panels">) {
//     this.dashboard = { ...dashboard, panels: [] };
//   }

//   addPanel<PanelVariables extends VariableDefinitions>(panel: Panel<DashboardVariables, PanelVariables>) {
//     this.dashboard.panels.push(panel as Panel<DashboardVariables, VariableDefinitions>);
//     return this;
//   }
// }

// const d = new DashboardBuilder({
//   name: "dash",
//   variables: {
//     currency: {
//       label: "Currency",
//       options: () => ["EUR"],
//       default: "EUR",
//     },
//   },
// })
//   .addPanel({
//     kind: "html",
//     variables: {
//       name: {
//         label: "Name",
//         options: () => ["EUR"],
//         default: "a",
//       },
//     },
//     spec: ({ variables }) => {
//       const x: string = variables.currency;
//       const y: string = variables.name;
//       return "";
//     },
//   })
//   .addPanel({
//     kind: "html",
//     variables: {
//       name2: {
//         label: "Name",
//         options: () => ["EUR"],
//         multiple: true,
//         default: ["a"],
//       },
//     },
//     spec: ({ variables }) => {
//       const x: string = variables.currency;
//       const y: string[] = variables.name2;
//       return "";
//     },
//   });
