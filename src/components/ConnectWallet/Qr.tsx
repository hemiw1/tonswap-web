import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useStyles } from "./style";
import CloseIcon from "@mui/icons-material/Close";
import QRImage from "assets/images/connect/qr.svg";
import QRLine from "assets/images/connect/qr-line.svg";
import {  Fade } from "@mui/material";
import { Popup } from "components/Popup";

const qrResultMidifier = (result: string) => {
  const splitted = result.split("/");
  return splitted[splitted.length - 1];
};
interface Props {
  setAddress: (val: string) => void;
}

const QR = ({ setAddress }: Props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const onResult = (value: string) => {
    setAddress(value);
    setOpen(false);
  };

  return (
    <div className={classes.qrContainer}>
      <Popup backgroundColor="rgba(0,0,0, 0.01)" open={open} className={classes.qrPoup}>
        <Box className={classes.qrWindow}>
          <Box className={classes.qrClose}>
            <IconButton
              onClick={() => setOpen(false)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              style={{ padding: 0, marginLeft: 0, color: "white" }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>
          <QrReader
            videoStyle={{
              objectFit: "cover",
              borderRadius: "50%",
            }}
            constraints={{ facingMode: "environment" }}
            onResult={(result: any, error: any) => {
              if (result) {
                onResult(qrResultMidifier(result.text));
              }
            }}
          />
        </Box>
      </Popup>

      <Fade in={!open}>
        <div className={classes.qrImages} onClick={() => setOpen(true)}>
          <img src={QRImage} className={classes.qrImage} alt='qr' />
         <Box className={classes.qrLineImg}>
         <img src={QRLine}  alt='qr' />
         </Box>
        </div>
      </Fade>
    </div>
  );
};

export default QR;
