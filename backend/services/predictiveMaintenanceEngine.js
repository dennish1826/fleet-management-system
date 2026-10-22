export const evaluatePredictiveHealth = (vehicle) => {
  const alertsToGenerate = [];
  const diagnostics = vehicle.diagnostics || {};
  const vehicleCode = vehicle.vehicleId || 'VH-UNK';

  // 1. Engine Temperature Spike Evaluation
  if (diagnostics.engineTemperature >= 105) {
    alertsToGenerate.push({
      type: 'Maintenance',
      severity: 'Critical',
      message: `Vehicle #${vehicleCode} engine temperature spike detected (${diagnostics.engineTemperature}°C). Predictive risk of cooling system failure within 48 hours. Schedule maintenance immediately.`,
      recommendation: 'Perform radiator flush, inspect water pump seal, and test thermostat valve.',
      metadata: {
        sensor: 'CoolantTemp',
        value: diagnostics.engineTemperature,
        threshold: 105,
        predictedComponent: 'Cooling System & Radiator',
      },
    });
  } else if (diagnostics.engineTemperature > 98) {
    alertsToGenerate.push({
      type: 'Maintenance',
      severity: 'Warning',
      message: `Vehicle #${vehicleCode} running hotter than normal (${diagnostics.engineTemperature}°C). Elevated cooling load detected.`,
      recommendation: 'Inspect coolant reservoir level and clean debris from radiator grille.',
      metadata: {
        sensor: 'CoolantTemp',
        value: diagnostics.engineTemperature,
        threshold: 98,
        predictedComponent: 'Thermostat / Fan Clutch',
      },
    });
  }

  // 2. Oil Life Degradation Rule
  if (diagnostics.oilLifePercentage !== undefined && diagnostics.oilLifePercentage < 15) {
    alertsToGenerate.push({
      type: 'Maintenance',
      severity: 'Warning',
      message: `Vehicle #${vehicleCode} oil life degraded to ${diagnostics.oilLifePercentage}%. Lubrication breakdown imminent.`,
      recommendation: 'Schedule full synthetic oil and oil filter replacement within 500 km.',
      metadata: {
        sensor: 'OilLife',
        value: diagnostics.oilLifePercentage,
        threshold: 15,
        predictedComponent: 'Engine Lubrication',
      },
    });
  }

  // 3. Battery & Alternator Voltage Check
  if (diagnostics.batteryVoltage !== undefined && diagnostics.batteryVoltage < 11.8) {
    alertsToGenerate.push({
      type: 'Maintenance',
      severity: 'Critical',
      message: `Vehicle #${vehicleCode} system voltage dropped to ${diagnostics.batteryVoltage}V. Alternator/battery failure risk within 24h.`,
      recommendation: 'Test battery cranking amps and verify alternator charging output.',
      metadata: {
        sensor: 'BatteryVoltage',
        value: diagnostics.batteryVoltage,
        threshold: 11.8,
        predictedComponent: 'Charging System / Alternator',
      },
    });
  }

  // 4. Brake Pad Life Wear Rule
  if (diagnostics.brakePadLifePercentage !== undefined && diagnostics.brakePadLifePercentage < 18) {
    alertsToGenerate.push({
      type: 'Maintenance',
      severity: 'Warning',
      message: `Vehicle #${vehicleCode} brake pad friction lining at ${diagnostics.brakePadLifePercentage}%. Rotor damage risk.`,
      recommendation: 'Replace front and rear disc brake pads.',
      metadata: {
        sensor: 'BrakeWear',
        value: diagnostics.brakePadLifePercentage,
        threshold: 18,
        predictedComponent: 'Braking Assembly',
      },
    });
  }

  // 5. Diagnostic Trouble Code (DTC) Expert System
  const dtcExplanations = {
    P0128: {
      desc: 'Thermostat valve stuck open; coolant temp below threshold',
      component: 'Thermostat Housing',
      severity: 'Warning',
      action: 'Replace thermostat assembly and coolant temperature sensor.',
    },
    P0300: {
      desc: 'Random/multiple cylinder misfire detected',
      component: 'Ignition Coils & Spark Plugs',
      severity: 'Critical',
      action: 'Inspect spark plugs, fuel injectors, and ignition coil packs to prevent catalytic meltdown.',
    },
    P0420: {
      desc: 'Catalyst system efficiency below threshold (Bank 1)',
      component: 'Exhaust & Catalytic Converter',
      severity: 'Warning',
      action: 'Inspect O2 sensors and exhaust leak before replacing converter.',
    },
    P0562: {
      desc: 'System low electrical voltage detected by ECM',
      component: 'Electrical System',
      severity: 'Critical',
      action: 'Inspect ground strap connections and alternator diode pack.',
    },
  };

  if (Array.isArray(diagnostics.dtcCodes)) {
    diagnostics.dtcCodes.forEach((code) => {
      const diagnosis = dtcExplanations[code] || {
        desc: `Diagnostic Trouble Code ${code} logged in ECM`,
        component: 'Engine Control Module',
        severity: 'Warning',
        action: 'Connect OBD-II diagnostic scanner for deep scan.',
      };

      alertsToGenerate.push({
        type: 'Diagnostic Fault',
        severity: diagnosis.severity,
        message: `Vehicle #${vehicleCode} logged DTC ${code}: ${diagnosis.desc}`,
        recommendation: diagnosis.action,
        metadata: {
          sensor: 'OBD-II DTC',
          code,
          predictedComponent: diagnosis.component,
        },
      });
    });
  }

  return alertsToGenerate;
};
