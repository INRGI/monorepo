import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Character, Item } from '../../types/types';
import { Container } from '../BattleContainer/BattleContainer.styled';
import {
  AuctionContainer,
  EquipButton,
  InventoryCard,
  InventoryContainer,
  ModalContainer,
  ItemTitle,
  ItemDetails,
} from './Inventory.styled';
import { toastCustom } from '../../helpers/toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Inventory {
  hero: Character;
  updateHero: (hero: Character) => void;
  handleFetchHero: () => void;
}

const Inventory: React.FC<Inventory> = ({
  hero,
  updateHero,
  handleFetchHero,
}) => {
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [auctionPrice, setAuctionPrice] = useState<number>(0);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/inventory/${hero._id}`
      );
      setInventoryItems(response.data.inventory || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [hero._id]);

  const handleItemSell = async (
    uniqueId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:3000/inventory/sell/${hero._id}/${uniqueId}`
      );
      setInventoryItems(response.data || []);
      toastCustom(`✅ Item Sold`);
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setLoading(false);
      fetchInventory();
      updateHero(hero);
    }
  };

  const handleItemClick = async (item: Item) => {
    setModalIsOpen(true);
    setActiveItem(item);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setActiveItem(null);
  };

  const handleAuctionList = async () => {
    if (!activeItem) return;
    try {
      setLoading(true);
      await axios.post(`http://localhost:3000/auction/open`, {
        sellerId: hero._id,
        uniqueItemId: activeItem.uniqueId,
        price: auctionPrice,
        name: activeItem.name,
        rarity: activeItem.rarity,
      });
      toastCustom(`✅ Item went to the auction`);
      closeModal();
    } catch (error) {
      console.error('Failed to list item on auction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEquipItem = async () => {
    if (!activeItem) return;
    await axios.post(`http://localhost:3000/inventory/equip`, {
      heroId: hero._id,
      uniqueId: activeItem.uniqueId,
    });
    toastCustom(`🛡️ Item equipped`);
    closeModal();
    handleFetchHero();
    fetchInventory();
  };

  const handleReenchantItem = async (item: Item) => {
    const response = await axios.post(`http://localhost:3000/enchant/reenchant`, {
      heroId: hero._id,
      item: activeItem,
      price: 1000,
    });

    setActiveItem(response.data)
    fetchInventory();
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h3>Your Inventory</h3>
      <InventoryContainer>
        {inventoryItems.map((item, key) => (
          <InventoryCard
            key={key}
            onClick={() => handleItemClick(item)}
            rarity={item.rarity}
          >
            <img src={item.image} alt={item.name} />
            <ItemTitle>{item.name}</ItemTitle>
            <ItemDetails>Type: {item.type}</ItemDetails>
            <ItemDetails>Rarity: {item.rarity}</ItemDetails>
            <button onClick={(event) => handleItemSell(item.uniqueId, event)}>
              Sell Item
            </button>
          </InventoryCard>
        ))}
      </InventoryContainer>

      <ModalContainer
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        }}
        contentLabel="Item Details"
      >
        <h2>Item Details</h2>
        {activeItem && (
          <div>
            <img width={300} src={activeItem.image} alt={activeItem.name} />
            <h4>{activeItem.name}</h4>
            <p>Type: {activeItem.type}</p>
            <p>Rarity: {activeItem.rarity}</p>
            <p>Enchanted: {activeItem.enchanted}</p>
            <button onClick={() => handleReenchantItem(activeItem)}>
              Reenchant(1000 coins)
            </button>
            {(activeItem.stats.attack && (
              <p>Attack: {activeItem.stats.attack}</p>
            )) ||
              (activeItem.stats.health && (
                <p>Health: {activeItem.stats.health}</p>
              ))}
            <EquipButton onClick={handleEquipItem}>Equip</EquipButton>
          </div>
        )}
        <AuctionContainer>
          <input
            type="number"
            value={auctionPrice}
            onChange={(e) => setAuctionPrice(Number(e.target.value))}
            placeholder="Enter auction price"
          />
          <button onClick={handleAuctionList}>Add to Auction</button>
        </AuctionContainer>
      </ModalContainer>
    </Container>
  );
};

export default Inventory;
