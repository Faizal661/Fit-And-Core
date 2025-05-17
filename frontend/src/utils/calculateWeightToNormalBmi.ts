import { Progress } from "../types/progress.type";

export const calculateWeightToNormalBmi = (latestProgression: Progress) => {
    if (
      !latestProgression ||
      !latestProgression.height ||
      !latestProgression.bmi
    ) {
      return "";
    }

    const currentWeight = latestProgression.weight;
    const currentHeightCm = latestProgression.height;
    const currentBmi = latestProgression.bmi;
    const heightM = currentHeightCm / 100;

    const NORMAL_BMI_LOWER = 18.5;
    const NORMAL_BMI_UPPER = 24.9;

    let guidance = "";

    if (currentBmi < NORMAL_BMI_LOWER) {
      const targetWeightMin = NORMAL_BMI_LOWER * (heightM * heightM);
      const weightToGain = targetWeightMin - currentWeight;
      if (weightToGain > 0.1) {
        guidance = `To reach a normal BMI (target ${NORMAL_BMI_LOWER}), you could aim to gain approximately ${weightToGain.toFixed(
          1
        )} kg.`;
      } else if (weightToGain < -0.1) {
        guidance =
          "Your weight seems higher than expected for your BMI. Please check your entries.";
      } else {
        guidance =
          "You are very close to the normal BMI range. Maintain a healthy lifestyle.";
      }
    } else if (currentBmi > NORMAL_BMI_UPPER) {
      const targetWeightMax = NORMAL_BMI_UPPER * (heightM * heightM);
      const weightToLose = currentWeight - targetWeightMax;
      if (weightToLose > 0.1) {
        guidance = `To reach a normal BMI (target ${NORMAL_BMI_UPPER}), you could aim to lose approximately ${weightToLose.toFixed(
          1
        )} kg.`;
      } else if (weightToLose < -0.1) {
        guidance =
          "Your weight seems lower than expected for your BMI. Please check your entries.";
      } else {
        guidance =
          "You are very close to the normal BMI range. Maintain a healthy lifestyle.";
      }
    } else {
      guidance = "You are in the normal BMI range. Well done!";
    }
    return guidance;
  };