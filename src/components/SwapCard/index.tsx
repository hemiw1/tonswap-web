import { NumberInput } from "components/NumberInput";
import { PoolInfo } from "services/api/addresses";
import useWebAppResize from "hooks/useWebAppResize";
import { ROUTES } from "router/routes";
import { ton } from "tokens";
import { styled, Box } from "@mui/system";
import { Avatar, Typography } from "@mui/material";
import { useTokenOperationsStore } from "store/token-operations/hooks";
import { OperationType } from "store/token-operations/reducer";
import Balance from "./Balance";
import UsdAmount from "./UsdAmount";
import useNavigateWithParams from "hooks/useNavigateWithParams";
interface Props {
  inputAmount?: string;
  balance: string;
  onChange: (val: string) => void;
  token: PoolInfo;
  isLoading?: boolean;
  balanceLoading: boolean;
  onMaxAmount?: () => void;
  showMax?: boolean;
}

function SwapCard({
  inputAmount,
  onChange,
  token,
  isLoading,
  balanceLoading,
  balance,
  onMaxAmount,
  showMax,
}: Props) {
  const expanded = useWebAppResize();
  const navigate = useNavigateWithParams();
  const { operationType } = useTokenOperationsStore();
  const isTon = token.name === ton.name;

  const onTokenSelect = () => {
    if (isTon) {
      return;
    }
    if (operationType === OperationType.SWAP) {
      navigate(ROUTES.swap.navigateToTokens);
    } else {
      navigate(ROUTES.manageLiquidity.navigateToTokens);
    }
  };

  return (
    <StyledContainer className="swap-card">
      <StyledBg color={token.color} />
      <div style={{ position: "relative" }}>
        <StyledInput expanded={expanded}>
          <NumberInput
            placeholder="0"
            isLoading={isLoading}
            value={inputAmount}
            onChange={(val) => onChange(val)}
          />
          <StyledTokenDisplay
            style={{
              cursor: isTon ? "" : "pointer",
              userSelect: isTon ? "none" : "all",
            }}
            onClick={onTokenSelect}
          >
            {token.image && <StyledAvatar src={token.image} alt="token" />}
            <Typography>{token.displayName}</Typography>
            {!isTon && <div className="arrow"></div>}
          </StyledTokenDisplay>
        </StyledInput>

        <StyledBottom>
          <UsdAmount
            isLoading={isLoading}
            value={inputAmount}
            name={token.name}
          />
          <Balance
            availableAmount={balance}
            displayName={token.displayName}
            loading={balanceLoading}
            onMaxAmountClick={onMaxAmount}
            showMax={showMax}
          />
        </StyledBottom>
      </div>
    </StyledContainer>
  );
}

export default SwapCard;

const StyledContainer = styled(Box)({
  borderRadius: 12,
  padding: "18px",
  display: "flex",
  position: "relative",
  overflow: "hidden",
  flexDirection: "column",
});

const StyledTokenDisplay = styled(Box)({
  padding: "0px 8px",
  display: "flex",
  alignItems: "center",
  gap: 10,
  position: "relative",
  background: "rgba(255,255,255, 0.1)",
  borderRadius: 12,
  height: "100%",
  boxShadow: "rgb(0 0 0 / 8%) 0px 6px 10px",
  ".arrow": {
    width: 7,
    height: 7,
    borderLeft: "2px solid white",
    borderBottom: "2px solid white",
    transform: "rotate(-45deg)",
    position: "relative",
    top: "-2px",
  },
  p: {
    color: "white",
    fontSize: 12,
    fontWeight: 600,
  },
});

const StyledAvatar = styled(Avatar)({
  width: 24,
  height: 24,
});

const StyledBottom = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: 25,
  marginTop: 10,
  p: {
    color: "white",
    fontSize: 12,
    fontWeight: 400,
  },
});

const StyledInput = styled(Box)(({ expanded }: { expanded: boolean }) => ({
  paddingRight: 10,
  position: "relative",
  background: "rgba(255,255,255, 0.1)",
  width: "100%",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  height: expanded ? 54 : 42,
  padding: expanded ? 10 : 5,
  ".input-container": {
    width: "100%",
    height: "100%",
    input: {
      color: "white",
      fontSize: 29,
      fontWeight: 600,
      height: "100%",
      paddingRight: 10,
      textIndent: 5,
    },
  },
}));

const StyledBg = styled(Box)(({ color }: { color: string }) => ({
  background: color,
  width: "100%",
  position: "absolute",
  height: "100%",
  left: 0,
  top: 0,
  pointerEvents: "none",
  opacity: 0.93,
}));
