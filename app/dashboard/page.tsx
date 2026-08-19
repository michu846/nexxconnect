const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  // Get the current logged-in user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    alert('You must be logged in to save.');
    setSaving(false);
    return;
  }

  // Include user_id in the payload
  const cardData = {
    ...card,
    user_id: user.id, // REQUIRED for RLS policy to pass
    handle: card.handle.toLowerCase().trim(),
  };

  const { error } = await supabase
    .from('cards')
    .upsert(cardData, { onConflict: 'user_id' });

  if (error) {
    alert('Error saving: ' + error.message);
  } else {
    alert('Card saved successfully!');
  }

  setSaving(false);
};