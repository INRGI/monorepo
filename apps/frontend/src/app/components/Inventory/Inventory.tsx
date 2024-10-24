import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Character, Item } from '../../types/types';
import { Container } from '../BattleContainer/BattleContainer.styled';
import { ModalContainer } from '../BoxContainer/BoxContainer.styled';
import {
  AuctionContainer,
  InventoryCard,
  InventoryContainer,
} from './Inventory.styled';

interface Inventory {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const Inventory: React.FC<Inventory> = ({ hero, updateHero }) => {
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
        rarity: activeItem.rarity
      });
      closeModal();
    } catch (error) {
      console.error('Failed to list item on auction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h3>Your Inventory</h3>
      <InventoryContainer>
        {inventoryItems.map((item, key) => (
          <InventoryCard key={key} onClick={() => handleItemClick(item)}>
            <img src={item.image} alt={item.name} />
            <h4>{item.name}</h4>
            <p>Type: {item.type}</p>
            <p>Rarity: {item.rarity}</p>
            <p>Enchanted: {item.enchanted}</p>
            <button onClick={(event) => handleItemSell(item.uniqueId, event)}>
              Sell Item
            </button>
          </InventoryCard>
        ))}
      </InventoryContainer>

      <ModalContainer
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
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
            {(activeItem.stats.attack && (
              <p>Attack: {activeItem.stats.attack}</p>
            )) ||
              (activeItem.stats.health && (
                <p>Health: {activeItem.stats.health}</p>
              ))}
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
