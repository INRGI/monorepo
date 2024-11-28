import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { toastCustom } from "../../helpers/toastify";

interface HeroSetting {
  heroId: string;
  models: string[];
  hero3DModel: string;
}

interface UpdateHeroSettingDto {
  heroId: string;
  hero3DModel: string;
}

const SettingsButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  background-color: #212529;
  color: #ffffff;
  padding: 28px, 30px;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s;

  &:hover {
    background-color: #343a40;
    transform: scale(1.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  position: relative;
  background: #2c2f33;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #868e96;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: #ffffff;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #495057;
  background-color: #343a40;
  color: #ffffff;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #0d6efd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const HeroSettingsMenu: React.FC<{ heroId: string }> = ({ heroId }) => {
  const [heroSetting, setHeroSetting] = useState<HeroSetting | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

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
  }, [heroId]);

  const handleUpdateModel = async () => {
    if (!heroSetting) return;

    try {
      const updateData: UpdateHeroSettingDto = {
        heroId: heroSetting.heroId,
        hero3DModel: selectedModel,
      };

      await axios.put("http://localhost:3000/heroSetting", updateData);
      toastCustom("Hero model updated successfully!");
      setModalOpen(false); 
      window.location.reload();
    } catch (error) {
      toastCustom("Failed to update hero model.");
    }
  };

  return (
    <>
      <SettingsButton onClick={() => setModalOpen(true)}>⚙️</SettingsButton>

      {isModalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setModalOpen(false)}>&times;</CloseButton>
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
                <SaveButton onClick={handleUpdateModel} disabled={selectedModel === heroSetting.hero3DModel}>
                  Save Changes
                </SaveButton>
              </>
            ) : (
              <p style={{ color: "#adb5bd" }}>Loading settings...</p>
            )}
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

export default HeroSettingsMenu;
