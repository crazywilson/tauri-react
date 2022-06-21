import { useEffect, useState } from "react";
import { useStyles } from "./styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/api/notification";
let permissionGranted = await isPermissionGranted();
if (!permissionGranted) {
  const permission = await requestPermission();
  permissionGranted = permission === "granted";
}

export default function Index() {
  const classes = useStyles();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [progress, setProgress] = useState(0);
  const [bmi, setBmi] = useState(0);
  useEffect(() => {
    if (progress === 100) {
      const bmi =
        Math.floor(
          (parseInt(weight, 10) * 10) /
            ((parseInt(height, 10) / 100) * (parseInt(height, 10) / 100))
        ) / 10;
      setBmi(bmi);
      if (bmi < 18.5) {
        sendNotification({
          title: "BMI提醒",
          body: "你的体重偏轻，注意加强饮食",
        });
      } else if (bmi >= 18.5 && bmi < 25) {
        sendNotification({ title: "BMI提醒", body: "你的体重正常，继续保持" });
      } else if (bmi >= 25 && bmi < 30) {
        sendNotification({ title: "BMI提醒", body: "你的体重偏胖，注意减肥" });
      }
    }
  }, [weight, height, progress]);
  return (
    <>
      <div className={classes.root}>
        <TextField
          className={classes.input}
          id="standard-basic"
          label="您的身高（cm）"
          aria-label="spacing"
          variant="outlined"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <TextField
          className={classes.input}
          id="outlined-basic"
          label="您的体重（KG）"
          aria-label="spacing"
          variant="outlined"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <Button
          className={classes.input}
          variant="contained"
          color="primary"
          onClick={() => {
            setProgress(0);
            const timer = setInterval(() => {
              if (progress < 100) {
                setProgress((pre) => {
                  if (pre === 100) {
                    clearInterval(timer);
                  }
                  const diff = Math.random() * 10;
                  return Math.min(pre + diff, 100);
                });
              }
            }, 200);
          }}
        >
          开始计算
        </Button>
      </div>
      {progress !== 0 && (
        <div className={classes.progress}>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                progress
              )}%`}</Typography>
            </Box>
          </Box>
        </div>
      )}
      {progress === 100 && (
        <div className={classes.result}>
          您的BIM是：
          <span className={classes.resultText}>{bmi}</span>
        </div>
      )}
    </>
  );
}
