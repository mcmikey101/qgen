import React, { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { fakeDecks } from './Home_components/fakeDecks';
import type { NewDeckValues } from './Home_components/types';
import DeckFilters from './Home_components/DeckFilters';
import DeckGrid from './Home_components/DeckGrid';
import CreateDeckDialog from './Home_components/CreateDeckDialog';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const uniqueTags = useMemo(
    () => Array.from(new Set(fakeDecks.flatMap((deck) => deck.tags))),
    []
  );

  const filteredDecks = useMemo(
    () =>
      fakeDecks.filter(
        (deck) =>
          deck.name.toLowerCase().includes(search.toLowerCase()) &&
          (filterTag === '' || deck.tags.includes(filterTag))
      ),
    [search, filterTag]
  );

  const handleCreateDeck = (values: NewDeckValues) => {
    // todo создание колоды
    console.log(values);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <DeckFilters
        search={search}
        onSearchChange={setSearch}
        filterTag={filterTag}
        onFilterTagChange={setFilterTag}
        tags={uniqueTags}
        onCreateClick={() => setIsDialogOpen(true)}
      />

      <DeckGrid decks={filteredDecks} />

      <CreateDeckDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateDeck}
      />
    </Box>
  );
};

export default Home;