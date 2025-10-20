# LaTeX Math Test Document

This document tests the LaTeX math functionality in VibeMD.

## Inline Math Examples

Here are some inline math examples:
- The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- Einstein's mass-energy equivalence: $E = mc^2$
- The derivative: $\frac{dy}{dx} = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$

## Block Math Examples

Here are some block math examples:

The integral of a function:
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

The matrix equation:
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}$$

## Complex Math Examples

Summation notation:
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

Limit definition:
$$\lim_{x \to 0} \frac{\sin(x)}{x} = 1$$

## Testing Instructions

1. Enable LaTeX support in Settings > Editor Settings
2. Verify that math toolbar buttons appear
3. Test inline math with the SquareFunction button (inserts $E = mc^2$)
4. Test block math with the SquarePower button (inserts integral example)
5. Test math operators: +, -, ×, ÷
6. Verify that math renders correctly in the editor
7. Save and reload to ensure math persists
8. Try typing LaTeX directly: $x^2 + y^2 = z^2$ and $$\sum_{i=1}^{n} x_i$$