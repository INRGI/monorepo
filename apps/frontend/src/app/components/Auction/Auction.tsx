import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from '../BattleContainer/BattleContainer.styled';
import { AuctionCard, AuctionContainer, ModalContainer } from './Auction.styled';
import { Item } from '../../types/types';

interface AuctionProps {
  heroId: string;
  updateHero: (updatedHero: any) => void;
}

const Auction: React.FC<AuctionProps> = ({ heroId, updateHero }) => {
  const [auctionItems, setAuctionItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchAuctionItems = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/auction`);
      setAuctionItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch auction items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionItems();
  }, []);

  const handleBuyItem = async (item: Item) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/auction/buy', {
        newOwnerHeroId :heroId,
        id: item.id,
        oldOwnerHeroId: item.sellerId,
        price: item.price,
        uniqueId: item.uniqueItemId
      });
      updateHero(response.data.updatedHero);
    } catch (error) {
      console.error('Failed to buy item:', error);
    } finally {
      setLoading(false);
      fetchAuctionItems();
    }
  };

  const handleOpenItemModal = async (item: Item) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auction/${item.id}`
      );
      setSelectedItem(response.data);
    } catch (error) {
      console.error('Failed to fetch auction items:', error);
    } finally {
      setLoading(false);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem(null);
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <h3>Auction</h3>
      <AuctionContainer>
        {auctionItems.map((item, key) => (
          <AuctionCard key={key}>
            <h4>{item.name}</h4>
            <p>Rarity: {item.rarity}</p>
            <p>Price: {item.price}</p>
            <button onClick={() => handleBuyItem(item)}>
              Buy Item
            </button>
            <button onClick={() => handleOpenItemModal(item)}>Details</button>
            <ModalContainer
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Item Details"
            >
              <h2>Item Details</h2>
              {selectedItem && (
                <div>
                  <img
                    width={300}
                    src={selectedItem.image}
                    alt={selectedItem.name}
                  />
                  <h4>{selectedItem.name}</h4>
                  <p>Type: {selectedItem.type}</p>
                  <p>Rarity: {selectedItem.rarity}</p>
                  <p>Price: {item.price}</p>
                  <p>Enchanted: {selectedItem.enchanted}</p>
                  {(selectedItem.stats.attack && (
                    <p>Attack: {selectedItem.stats.attack}</p>
                  )) ||
                    (selectedItem.stats.health && (
                      <p>Health: {selectedItem.stats.health}</p>
                    ))}
                  <button onClick={closeModal}>Close</button>
                </div>
              )}
            </ModalContainer>
          </AuctionCard>
        ))}
      </AuctionContainer>
    </Container>
  );
};

export default Auction;
