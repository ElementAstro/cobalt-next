import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { motion } from "framer-motion";
import styled from "styled-components";

interface Parameter {
  name: string;
  value: string;
}

interface RunParametersConfigProps {
  parameters: Parameter[];
  onChange: (parameters: Parameter[]) => void;
}

const Container = styled.div`
  background-color: #121212;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const ParameterRow = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ParameterInput = styled(Input)`
  margin-right: 10px;
  flex: 1;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;

export function RunParametersConfig({
  parameters,
  onChange,
}: RunParametersConfigProps) {
  const [newParam, setNewParam] = useState<Parameter>({ name: "", value: "" });
  const [error, setError] = useState<string | null>(null);

  const handleAddParameter = () => {
    if (newParam.name && newParam.value) {
      onChange([...parameters, newParam]);
      setNewParam({ name: "", value: "" });
      setError(null);
    } else {
      setError("参数名称和值不能为空");
    }
  };

  const handleRemoveParameter = (index: number) => {
    const updatedParams = parameters.filter((_, i) => i !== index);
    onChange(updatedParams);
  };

  return (
    <Container>
      <h2>运行参数配置</h2>
      {parameters.map((param, index) => (
        <ParameterRow
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <ParameterInput value={param.name} readOnly />
          <ParameterInput value={param.value} readOnly />
          <Button onClick={() => handleRemoveParameter(index)}>
            <Trash />
          </Button>
        </ParameterRow>
      ))}
      <ParameterRow
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        <ParameterInput
          placeholder="参数名称"
          value={newParam.name}
          onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
        />
        <ParameterInput
          placeholder="参数值"
          value={newParam.value}
          onChange={(e) => setNewParam({ ...newParam, value: e.target.value })}
        />
        <Button onClick={handleAddParameter}>
          <Plus />
        </Button>
      </ParameterRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
}
