import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Quote, QuoteItem } from '@/types';
import { generateQuote, updateQuoteInDB, sendQuoteToCustomer } from '@/services/quoteService';
import { formatCurrency } from '@/utils/formatters';

// Define the shape of the quote state
interface QuoteState {
  currentQuote: Quote | null;
  quoteHistory: Quote[];
  isLoading: boolean;
  error: string | null;
}

// Define the initial state
const initialState: QuoteState = {
  currentQuote: null,
  quoteHistory: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching a specific quote
export const fetchQuote = createAsyncThunk<Quote, string>(
  'quote/fetchQuote',
  async (quoteId, { rejectWithValue }) => {
    try {
      // Call the quoteService to fetch the quote by ID
      const quote = await quoteService.fetchQuoteById(quoteId);
      return quote;
    } catch (error) {
      return rejectWithValue('Failed to fetch quote');
    }
  }
);

// Async thunk for generating a new quote
export const generateNewQuote = createAsyncThunk<Quote, object>(
  'quote/generateNewQuote',
  async (quoteParams, { rejectWithValue }) => {
    try {
      // Call the generateQuote service with quote parameters
      const newQuote = await generateQuote(quoteParams);
      return newQuote;
    } catch (error) {
      return rejectWithValue('Failed to generate new quote');
    }
  }
);

// Async thunk for updating an existing quote
export const updateQuote = createAsyncThunk<Quote, Quote>(
  'quote/updateQuote',
  async (updatedQuote, { rejectWithValue }) => {
    try {
      // Call the updateQuoteInDB service with the updated quote
      const result = await updateQuoteInDB(updatedQuote);
      return result;
    } catch (error) {
      return rejectWithValue('Failed to update quote');
    }
  }
);

// Async thunk for sending a quote to the customer
export const sendQuote = createAsyncThunk<void, string>(
  'quote/sendQuote',
  async (quoteId, { rejectWithValue }) => {
    try {
      // Call the sendQuoteToCustomer service with the quote ID
      await sendQuoteToCustomer(quoteId);
    } catch (error) {
      return rejectWithValue('Failed to send quote to customer');
    }
  }
);

// Create the quote slice
export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setCurrentQuote: (state, action: PayloadAction<Quote>) => {
      state.currentQuote = action.payload;
    },
    addQuoteToHistory: (state, action: PayloadAction<Quote>) => {
      state.quoteHistory.push(action.payload);
    },
    updateQuoteItem: (state, action: PayloadAction<QuoteItem>) => {
      if (state.currentQuote) {
        const index = state.currentQuote.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.currentQuote.items[index] = action.payload;
        }
      }
    },
    setQuoteLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setQuoteError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(generateNewQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateNewQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuote = action.payload;
        state.quoteHistory.push(action.payload);
      })
      .addCase(generateNewQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuote = action.payload;
        const index = state.quoteHistory.findIndex(quote => quote.id === action.payload.id);
        if (index !== -1) {
          state.quoteHistory[index] = action.payload;
        }
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(sendQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendQuote.fulfilled, (state) => {
        state.isLoading = false;
        if (state.currentQuote) {
          state.currentQuote.status = 'sent';
        }
      })
      .addCase(sendQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { setCurrentQuote, addQuoteToHistory, updateQuoteItem, setQuoteLoading, setQuoteError } = quoteSlice.actions;

// Export selectors
export const selectCurrentQuote = (state: RootState) => state.quote.currentQuote;
export const selectQuoteHistory = (state: RootState) => state.quote.quoteHistory;

export default quoteSlice.reducer;