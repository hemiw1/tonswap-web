import { Box } from "@mui/system";
import SwapCard from "components/SwapCard/index";
import { useEffect, useRef } from "react";
import { PoolInfo } from "services/api/addresses";
import {
  useTokenOperationsActions,
  useTokenOperationsStore,
} from "store/token-operations/hooks";
import { InInput } from "store/token-operations/reducer";
import { useWalletStore } from "store/wallet/hooks";
import { fromNano, toNano } from "ton";
import { useDebouncedCallback } from "use-debounce";
import { calculateTokens } from "./util";
interface Props {
  token: PoolInfo;
  destTokenName: string;
  getAmountFunc: any;
  maxAmount: string;
  disableInputDependency?: boolean
}

const SrcToken = ({
  token,
  getAmountFunc,
  destTokenName,
  maxAmount,
  disableInputDependency
}: Props) => {
  const {
    srcTokenAmount,
    totalBalances,
    srcLoading,
    srcAvailableAmountLoading,
    inInput
  } = useTokenOperationsStore();

  const { address } = useWalletStore();
  const {
    updateDestTokenAmount,
    updateSrcTokenAmount,
    updateDestTokenLoading,
    onInputChange
  } = useTokenOperationsActions();

  const balanceRef = useRef("");
  const debounce = useDebouncedCallback(async () => {
    if (!balanceRef.current) {
      return;
    }
    let result = 0;
    const jetton = token.name === "ton" ? destTokenName : token.tokenMinter;
    try {
      result = await calculateTokens(
        jetton,
        token.name !== "ton",
        toNano(balanceRef.current || "0"),
        null,
        getAmountFunc
      );

      if (!balanceRef.current) {
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (!balanceRef.current) {
        return;
      }
      updateDestTokenLoading(false);
      // TODO ...

      if (result === 0) {
        return;
      } else {
        updateDestTokenAmount(fromNano(result));
      }
    }
  }, 600);

  const onChange = (value: string) => {
    updateSrcTokenAmount(value);
    if(disableInputDependency){
      return 
    }
    onInputChange(InInput.SOURCE)
    balanceRef.current = value;

    if (!value || Number(value) === 0) {
      updateDestTokenAmount("");
      updateDestTokenLoading(false);
    } else {
      updateDestTokenLoading(true);
      debounce();
    }
  };

  useEffect(() => {
    if (srcTokenAmount && inInput === InInput.SOURCE) {
       onChange(srcTokenAmount);
    }
  }, []);


  

  return (
    <SwapCard
        onMaxAmount={() => onChange(maxAmount)}
        isLoading={srcLoading}
        onChange={onChange}
        inputAmount={srcTokenAmount}
        balance={totalBalances.srcBalance}
        token={token}
        balanceLoading={srcAvailableAmountLoading}
        showMax={srcTokenAmount !== maxAmount && !!address}
      />
  );
};

export default SrcToken;
