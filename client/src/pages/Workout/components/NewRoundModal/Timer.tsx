import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Stack,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  alpha,
} from "@mui/material";
import {
  TimerOutlined,
  UpdateOutlined,
  AlarmOnOutlined,
  PauseOutlined,
  PlayCircleOutline,
  PlayArrow,
  Timer10,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
export interface Props {
  time: number;
  defaultTime: number;
  timerOn: boolean;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setTimeOn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Timer({
  time,
  defaultTime,
  setTime,
  timerOn,
  setTimeOn,
}: Props) {
  function fmtMSS(time: number) {
    return (time - (time %= 60)) / 60 + (9 < time ? ":" : ":0") + time;
  }

  return (
    <Stack alignItems="start">
      <Stack
        direction="row"
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        {/* <Stack direction="row" alignItems="center" justifyContent="center">
          <Stack direction="row" alignItems="center" justifyContent="center">
            <TimerOutlined />
            <Typography variant="body2">Rest</Typography>
          </Stack>
        </Stack> */}
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            align="center"
            sx={{
              backgroundColor: grey[100],
              width: "100%",
              borderRadius: 1,
              border: `1px solid ${grey[200]}}`,
            }}
            variant="h5"
          >
            {fmtMSS(time)}
          </Typography>
          <ButtonGroup variant="outlined" size="medium">
            <Button
              onClick={async () => {
                await setTimeOn(false);
                await setTime(time + 10);
                setTimeOn(true);
              }}
            >
              +<Timer10 />
            </Button>

            {timerOn && (
              <>
                <Button onClick={() => setTimeOn(false)}>
                  <PauseOutlined />
                </Button>
              </>
            )}
            {!timerOn && (
              <>
                <Button
                  onClick={() => {
                    if (time === 0) {
                      setTime(defaultTime);
                    }
                    setTimeOn(true);
                  }}
                >
                  <PlayArrow />
                </Button>
              </>
            )}
            <Button
              onClick={() => {
                setTimeOn(false);
                setTime(defaultTime);
              }}
            >
              <UpdateOutlined />
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Stack>
  );
}
