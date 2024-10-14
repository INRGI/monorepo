import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Character, Item } from '../../types/types';
import { Container } from '../BattleContainer/BattleContainer.styled';
import { ModalContainer } from '../BoxContainer/BoxContainer.styled';
import { InventoryCard, InventoryContainer } from './Inventory.styled';

interface Inventory {
  hero: Character;
  updateHero: (hero: Character) => void;
}

const Inventory: React.FC<Inventory> = ({ hero, updateHero }) => {
  const [inventoryItems, setInventoryItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openedItem, setOpenedItem] = useState<Item | null>(null);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/inventory/${hero._id}`);
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

  const handleItemDelete = async (itemId: string) => {
    try {
      setLoading(true)
      const response = await axios.delete(`http://localhost:3000/inventory/${hero._id}/${itemId}`);
      setInventoryItems(response.data || []);
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setLoading(false);
      fetchInventory();
      updateHero(hero);
    }
  }

  const handleItemClick = (item: Item) => {
    setOpenedItem(item);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setOpenedItem(null);
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
            <button onClick={() => handleItemDelete(item.uniqueId)}>Delete Item</button>
          </InventoryCard>
        ))}
      </InventoryContainer>

      <ModalContainer isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Item Details">
        <h2>Item Details</h2>
        {openedItem && (
          <div>
            <img width={300} src={openedItem.image} alt={openedItem.name} />
            <h4>{openedItem.name}</h4>
            <p>Type: {openedItem.type}</p>
            <p>Rarity: {openedItem.rarity}</p>
            <p>Enchanted: {openedItem.enchanted}</p>
            {openedItem.stats.attack && <p>Attack: {openedItem.stats.attack}</p> || openedItem.stats.health && <p>Health: {openedItem.stats.health}</p>}
          </div>
        )}
        <button onClick={closeModal}>Close</button>
      </ModalContainer>
    </Container>
  );
};

export default Inventory;
