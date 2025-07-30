from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import sys
import json

try:
  model_name = "microsoft/DialoGPT-small"
  tokenizer = AutoTokenizer.from_pretrained(model_name)
  model = AutoModelForCausalLM.from_pretrained(model_name)

  def generate_response(user_input):
      system_prompt = "You are a compassionate companion bot. Provide empathetic, supportive, and conversational responses to help the user feel understood and cared for."
      input_text = system_prompt + "\nUser: " + user_input + tokenizer.eos_token
      inputs = tokenizer.encode(input_text, return_tensors="pt")
      outputs = model.generate(inputs, max_length=100, pad_token_id=tokenizer.eos_token_id)
      response = tokenizer.decode(outputs[:, inputs.shape[-1]:][0], skip_special_tokens=True)
      return response

  if __name__ == "__main__":
      user_input = sys.argv[1] if len(sys.argv) > 1 else ""
      if not user_input:
          print(json.dumps({"error": "No input provided"}), file=sys.stderr)
          sys.exit(1)
      response = generate_response(user_input)
      print(json.dumps({"reply": response}))
except Exception as e:
  print(json.dumps({"error": str(e)}), file=sys.stderr)
  sys.exit(1)