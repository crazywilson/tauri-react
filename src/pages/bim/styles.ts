import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    display: "flex",
    padding: "10px 20px",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  input: {
    width: 100,
  },
  progress: {
    marginTop: 10,
  },
  result: {
    paddingTop: 20,
  },
  resultText: {
    color: "red",
  },
});
