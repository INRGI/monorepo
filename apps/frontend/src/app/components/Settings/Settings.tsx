/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";

interface HeroSetting {
  heroId: string;
  models: string[];
  hero3DModel: string;
}

interface UpdateHeroSettingDto {
  heroId: string;
  hero3DModel: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 2rem auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  padding: 0.8rem;
  font-size: 1rem;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 1rem;
  cursor: pointer;

  &:hover {
    border-color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${(props: { success: boolean }) => (props.success ? "green" : "red")};
`;

interface HeroSettingsMenuProps {
    heroId: string
  }

const HeroSettingsMenu: React.FC<HeroSettingsMenuProps> = ({heroId}) => {
  const [heroSetting, setHeroSetting] = useState<HeroSetting | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    const fetchHeroSetting = async () => {
      try {
        const response = await axios.get<HeroSetting>(`http://localhost:3000/heroSetting/${heroId}`);
        setHeroSetting(response.data);
        setSelectedModel(response.data.hero3DModel);
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      }
    };

    fetchHeroSetting();
  }, []);

  const handleUpdateModel = async () => {
    if (!heroSetting) return;

    try {
      const updateData: UpdateHeroSettingDto = {
        heroId: heroSetting.heroId,
        hero3DModel: selectedModel,
      };

      await axios.put("http://localhost:3000/heroSetting", updateData);
      setMessage({ text: "Hero model updated successfully!", success: true });
    } catch (error) {
      console.error("Error updating hero model:", error);
      setMessage({ text: "Failed to update hero model.", success: false });
    }
  };

  return (
    <Container>
      <Title>Hero Settings</Title>
      {heroSetting ? (
        <>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {heroSetting.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </Select>
          <Button onClick={handleUpdateModel} disabled={selectedModel === heroSetting.hero3DModel}>
            Save Changes
          </Button>
          {message && <Message success={message.success}>{message.text}</Message>}
        </>
      ) : (
        <p>Loading hero settings...</p>
      )}
    </Container>
  );
};

export default HeroSettingsMenu;
