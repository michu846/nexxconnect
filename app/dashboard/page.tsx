const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  // Get active session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    alert('Session expired. Please log in again.');
    setSaving(false);
    return;
  }

  const userId = session.user.id;

  // Check if a card already exists for this user
  const { data: existingCard } = await supabase
    .from('cards')
    .select('id')
    .eq('user_id', userId)
    .single();

  const cardPayload = {
    ...card,
    user_id: userId,
    handle: card.handle.toLowerCase().trim(),
  };

  let error;

  if (existingCard) {
    // Perform explicit UPDATE
    const response = await supabase
      .from('cards')
      .update(cardPayload)
      .eq('user_id', userId);
    error = response.error;
  } else {
    // Perform explicit INSERT
    const response = await supabase
      .from('cards')
      .insert([cardPayload]);
    error = response.error;
  }

  if (error) {
    alert('Error saving: ' + error.message);
  } else {
    alert('Card saved successfully!');
  }

  setSaving(false);
};